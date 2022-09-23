//configuracion de las variables de entorno
export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  mongoDb:
    process.env.MONGODB || 'mongodb://localhost:27017/nest-pokemon-gaston',
  port: process.env.PORT || 3002,
  defaultLimit: +process.env.DEFAULT_LIMIT || 7,
});
