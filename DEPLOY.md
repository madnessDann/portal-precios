# Guía de Despliegue en AWS Amplify

## Opción 1: AWS Amplify (Recomendado - Más Fácil)

### Requisitos Previos
- Cuenta de AWS
- Repositorio Git (GitHub, GitLab o Bitbucket)

### Pasos:

1. **Preparar el repositorio Git**
   ```bash
   git add .
   git commit -m "Preparar para despliegue"
   git push origin main
   ```

2. **Crear aplicación en AWS Amplify**
   - Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Haz clic en "New app" > "Host web app"
   - Conecta tu repositorio Git (GitHub/GitLab/Bitbucket)
   - Selecciona la rama `main` o `master`

3. **Configuración de Build**
   - Amplify detectará automáticamente que es una app Vite/React
   - O usa el archivo `amplify.yml` incluido en el proyecto
   - Build settings:
     ```
     Build command: npm run build
     Output directory: dist
     ```

4. **Variables de Entorno**
   - En la configuración de Amplify, agrega las variables de entorno:
     - `VITE_GOOGLE_SPREADSHEET_ID`
     - `VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL`
     - `VITE_GOOGLE_PRIVATE_KEY`

5. **Desplegar**
   - Haz clic en "Save and deploy"
   - Amplify construirá y desplegará automáticamente
   - Obtendrás una URL como: `https://main.xxxxx.amplifyapp.com`

---

## Opción 2: S3 + CloudFront (Más Control)

### Pasos:

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Crear bucket S3**
   - Ve a [S3 Console](https://console.aws.amazon.com/s3)
   - Crea un bucket nuevo
   - Desactiva "Block all public access"
   - Habilita "Static website hosting"

3. **Subir archivos**
   - Sube todo el contenido de la carpeta `dist/` al bucket
   - O usa AWS CLI:
     ```bash
     aws s3 sync dist/ s3://tu-bucket-name --delete
     ```

4. **Configurar CloudFront (CDN)**
   - Ve a [CloudFront Console](https://console.aws.amazon.com/cloudfront)
   - Crea una distribución
   - Origin: tu bucket S3
   - Default root object: `index.html`
   - Error pages: 404 -> `/index.html` (200)

5. **Variables de Entorno**
   - Necesitarás usar un servicio como AWS Systems Manager Parameter Store
   - O inyectar las variables en el build

---

## Opción 3: AWS Lightsail (Servidor Simple)

1. **Crear instancia Lightsail**
   - Ve a [Lightsail Console](https://lightsail.aws.amazon.com)
   - Crea una instancia Node.js
   - Conecta por SSH

2. **Instalar y configurar**
   ```bash
   git clone tu-repositorio
   cd tu-proyecto
   npm install
   npm run build
   ```

3. **Servir con nginx o similar**
   - Configura nginx para servir la carpeta `dist/`

---

## Recomendación

**Usa AWS Amplify** porque:
- ✅ Configuración automática
- ✅ Despliegue automático con cada push
- ✅ HTTPS incluido
- ✅ CDN automático
- ✅ Variables de entorno fáciles de configurar
- ✅ Rollback fácil si algo falla

## Notas Importantes

- Las variables de entorno que empiezan con `VITE_` deben estar configuradas en Amplify
- Asegúrate de que tu repositorio Git esté actualizado antes de desplegar
- El archivo `amplify.yml` ya está incluido en el proyecto
