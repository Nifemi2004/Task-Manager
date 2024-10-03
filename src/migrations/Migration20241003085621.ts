import { Migration } from '@mikro-orm/migrations';

export class Migration20241003085621 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`task\` (\`id\` int unsigned not null auto_increment primary key, \`description\` varchar(255) not null, \`status\` varchar(255) not null default 'active', \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null, \`due_date\` datetime null, \`is_timer_expired\` tinyint(1) not null default false) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`user\` (\`id\` int unsigned not null auto_increment primary key, \`username\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`task\`;`);

    this.addSql(`drop table if exists \`user\`;`);
  }

}
