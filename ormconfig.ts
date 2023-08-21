import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'g0g0m0g0',
  database: 'nest_tutorial',
  entities: ['build/**/*.dto.js'],
  synchronize: true,
};

export = config;
