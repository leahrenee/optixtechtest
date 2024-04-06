# Leah Andrew Optix Tech Test

## Local Development:

Frontend:
- `cd frontend`
- `npm install`
- `npm start`

Backend:
- `cd backend`
- `npm install`
- `npm start`


## Deployment:

    Run
    - docker compose up

For simplicity, I've chosen to 'deploy' the built frontend within a docker container utilizing the package [http-server](https://www.npmjs.com/package/http-server).

In production I would host the frontend application with Azure Static Web Apps or AWS S3.