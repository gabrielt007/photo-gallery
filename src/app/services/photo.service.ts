import { Injectable, signal } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
    providedIn: 'root',
})
export class PhotoService {

    public photos = signal<UserPhoto[]>([]);

    private PHOTO_STORAGE: string = 'photos';

    public async addNewToGallery() {

        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            saveToGallery: true,
            quality: 100,
        });

        const savedImageFile = await this.savePicture(capturedPhoto);

        this.photos.update((photos) => [savedImageFile, ...photos]);

        Preferences.set({
            key: this.PHOTO_STORAGE,
            value: JSON.stringify(this.photos()),
        });
    }

    private async savePicture(photo: Photo) {
        const base64Data = await this.base64FromPath(photo.webPath!);

        const fileName = Date.now() + '.jpeg';
        await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
    }

    private async base64FromPath(path: string): Promise<string> {
        const response = await fetch(path);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject('method did not return a string');
                }
            };
            reader.readAsDataURL(blob);
        });
    }

    public async deletePicture(photo: UserPhoto, position: number) {
        // Quita la foto del signal reactivo por posición
        this.photos.update((photos) => photos.filter((_, index) => index !== position));

        // Actualiza Preferences
        Preferences.set({
            key: this.PHOTO_STORAGE,
            value: JSON.stringify(this.photos()),
        });

        // Extrae solo el nombre del archivo y lo elimina de Directory.Data (no funcionó)
        const filename = photo.filepath.slice(photo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
            path: filename,
            directory: Directory.Data,
        });
    }

    public async loadSaved() {
        const { value: photoList } = await Preferences.get({ key: this.PHOTO_STORAGE });
        const photos = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];
        for (const photo of photos) {

            const file = await Filesystem.readFile({
                path: photo.filepath,
                directory: Directory.Data,
            });

            // Web platform only: Load the photo as base64 data
            photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }
        this.photos.set(photos);
    }
}

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}
