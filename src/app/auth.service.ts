import { Injectable } from "@angular/core";
import { Firestore, collection, query, where, getDocs, collectionData, QuerySnapshot, doc, getDoc, setDoc } from "@angular/fire/firestore";
import { from, Observable, of } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from "rxjs";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient, private firestore: Firestore, private router:Router, private afAuth:AngularFireAuth,private storage: AngularFireStorage,){}

        getUsers(): Observable<any[]>{
            const usersCollection = collection(this.firestore, 'users');
            return collectionData(usersCollection, {idField: 'id'});
        }

        getFilteredUsers(nombre: string, pais: string, apodo:string): Observable<any[]>{
            let usersCollection = collection(this.firestore, 'users');
            let q = query(usersCollection);

            if (nombre){
                q = query(q, where('name','==',nombre));
            }

            if (pais){
                q = query(q, where('country','==',pais));
            }

            if (apodo){
                q = query(q, where('nickname','==',apodo));
            }

            return from(getDocs(q).then(QuerySnapshot =>
                QuerySnapshot.docs.map(doc => doc.data())
            ));
        }

    async loginAndCheckFirestore(email: string, password: string): Promise<any> {
      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (user) {
          const userId = user.uid;

          // Usa la API modular para obtener el documento
          const userDocRef = doc(this.firestore, `User_AD/${userId}`);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            // Usuario autorizado
            return { authorized: true, user };
          } else {
            // Usuario no autorizado
            throw new Error('Usuario no autorizado');
          }
        }
      } catch (error) {
        console.error('Error en login o verificación:', error);
        throw error;
      }
    }

    // Observable para obtener el estado del usuario autenticado
  getUserData(): Observable<{ displayName: string | null, email: string | null, photoURL: string | null } | null> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          const userDocRef = doc(this.firestore, `User_AD/${userId}`);
          return getDoc(userDocRef).then(userSnapshot => {
            const userData = userSnapshot.exists() ? userSnapshot.data() : {};
            const displayName = user.displayName || userData['NOMBRE'] || 'Usuario';
            const photoURL = user.photoURL || userData['FOTO'] || null;
            return {
              displayName,
              email: user.email,
              photoURL
            };
          });
        } else {
          return of(null); // No hay usuario autenticado
        }
      })
    );
  }

  async registerUser(email: string, password: string, displayName: string, file: File | null): Promise<any> {
    try {
      // Registrar en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Subir foto a Firebase Storage (si existe)
        let photoURL = null;
        if (file) {
          const filePath = `profileImages/${user.uid}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          // Obtener la URL una vez que la imagen esté subida
          photoURL = await task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL())
          ).toPromise();

          photoURL = await fileRef.getDownloadURL().toPromise();
        }

        // Guardar el usuario en la colección User_AD
        const userData = {
          NOMBRE: displayName,
          CORREO: email,
          FOTO: photoURL || null,  // Si no hay foto, será null
        };

        await setDoc(doc(this.firestore, `User_AD/${user.uid}`), userData);

        return user;
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  }

   // Método para obtener las carpetas de países dentro de "modelos_3d"
   getCountries(): Observable<string[]> {
    const path = 'modelos_3d';
    const ref = this.storage.ref(path);

    return ref.listAll().pipe(
      map(result => result.prefixes.map(folderRef => folderRef.name))
    );
  }

  // Método para obtener las carpetas de género dentro de un país específico
  getGenders(country: string): Observable<string[]> {
    const path = `modelos_3d/${country}`;
    const ref = this.storage.ref(path);

    return ref.listAll().pipe(
      map(result => result.prefixes.map(folderRef => folderRef.name)) // Extrae nombres de subcarpetas de género
    );
  }

  // Método para listar hasta 4 archivos .glb desde Firebase Storage en la ruta especificada
  get3DAssets(country: string, gender: string): Observable<string[]> {
    const path = `modelos_3d/${country}/${gender}`;
    const ref = this.storage.ref(path);

    return ref.listAll().pipe(
      map(result => result.items.filter(item => item.name.endsWith('.glb')).slice(0, 4)), // Filtra solo archivos .glb y limita a 4
      switchMap(items => {
        const urls = items.map(item => item.getDownloadURL());
        return Promise.all(urls);
      }),
      map(urlArray => urlArray as string[])
    );
  }

  upload3DAsset(file: File, country: string, gender: string, position: string): Observable<any> {
    // Mapeo de posición a código de estado
    const estadoMapping: { [key: string]: string } = {
      'reposo': '01R',
      'activo': '02A',
      'derrota': '03D',
      'inactivo': '04I'
    };
  
    // Obtiene el código de estado para la posición seleccionada
    const estado = estadoMapping[position] || '00X'; // Código por defecto si no existe el estado
  
    // Genera el nombre del archivo usando el país y el estado
    const fileName = `${country}${estado}.glb`;
  
    // Construye la ruta completa en Firebase Storage
    const filePath = `modelos_3d/${country}/${gender}/${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
  
    // Retorna un observable que emite eventos de progreso y respuesta final
    return new Observable<any>((observer) => {
      // Observa los cambios de snapshot (progreso)
      task.percentageChanges().subscribe({
        next: (progress) => {
          if (progress !== undefined) {
            observer.next({ type: 'progress', value: progress });
          }
        },
        error: (error) => observer.error(error),
      });
  
      // Finaliza y obtiene la URL de descarga
      task.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const downloadURL = await fileRef.getDownloadURL().toPromise();
            observer.next({ type: 'response', value: downloadURL });
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        })
      ).subscribe();
    });
  }
}
