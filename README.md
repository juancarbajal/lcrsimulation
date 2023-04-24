# Simulación LCR

# Requerimientos:

Para ejecutar es necesario tener instalado:
- Docker
- Docker compose
- Un usuario AWS Cli configurado con los permisos para pruebas: AmazonSQSFullAccess, IAMFullAccess, CloudWatchFullAccess, AmazonDynamoDBFullAccess, AmazonEventBridgeFullAccess. Esto es requerido para levantar la infraestructura en AWS.
- Terraform

# Descripción de la aplicación 

1. La aplicación local esta implementada en Docker con docker-compose, esto incluye:
- Applicación principal.
- BD Redis para la lectura de los casos.
- AWS Lambda versión Docker con el algoritmo implementado.

2. Los servicios que no pueden correr en local estan implementados en AWS con Terraform como:
- Event Bridge
- Event Bridge Rule
- SQS
- DynamoDB

# Ejecución

## En Windows:

1. Copiamos el archivo .env.sample a .env y configuramos los valores de conexión a AWS :
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_KEY=
```

2. Ingresar a la carpeta infra y ejecutar terraform:
```
cd infra
terraform init
terraform apply
```
Aceptamos los cambios de Terraform para la infraestructura

3. Creamos la data de prueba 

Editamos el archivo src/app/migration/migration.redis y añadimos la data con la haremos las pruebas. Actualmente existe data de referencia. 

4. Ejecutamos la aplicación 

```
./run.bat 
```

5. Observamos los resultados de la simulación 

## En Linux (beta):

1. Copiamos el archivo .env.sample a .env y configuramos los valores de conexión a AWS :
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAQQ4WWS2VYVF2B73T
AWS_SECRET_KEY=RaTr150fSBLT/33GCN6yiFgcl5b1N+bvawMErflk
```

2. Ingresar a la carpeta infra y ejecutar terraform:
```
cd infra
terraform init
terraform apply
```

3. Creamos la data de prueba 

Editamos el archivo src/app/migration/migration.redis y añadimos la data con la haremos las pruebas. Actualmente existe data de referencia. 

4. Ejecutamos la aplicación
```
docker-compose build
docker-compose up -d
docker logs app_main -f
```

5. Observamos los resultados de la simulación
