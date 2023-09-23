import { INestApplication } from '@nestjs/common';
import { EntityManager } from 'typeorm';

export class DatabaseUtil {
  app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  public async clearAll(): Promise<void> {
    const entityManager = this.app.get<EntityManager>(EntityManager);
    const tableNames = entityManager.connection.entityMetadatas
      .map((entity) => entity.tableName)
      .join('", "');
    const schema = entityManager.connection.driver.schema;
    const query = `
      set search_path to ${schema};
      truncate table "${tableNames}" restart identity cascade;`;
    await entityManager.query(query);
  }
}
