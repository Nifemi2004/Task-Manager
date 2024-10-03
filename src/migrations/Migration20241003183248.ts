import { Migration } from '@mikro-orm/migrations';

export class Migration20241003183248 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`user\` (\`id\` int unsigned not null auto_increment primary key, \`username\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`task\` (\`id\` int unsigned not null auto_increment primary key, \`description\` varchar(255) not null, \`status\` varchar(255) not null default 'active', \`created_at\` datetime null default CURRENT_TIMESTAMP, \`updated_at\` datetime null, \`due_date\` datetime null, \`is_timer_expired\` tinyint(1) null default false, \`deleted_at\` datetime null, \`user_id\` int unsigned not null, \`reminder_enabled\` tinyint(1) null default false, \`reminder_time_gap_minutes\` int null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`task\` add index \`task_user_id_index\`(\`user_id\`);`);

    this.addSql(`alter table \`task\` add constraint \`task_user_id_foreign\` foreign key (\`user_id\`) references \`user\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`task\` drop foreign key \`task_user_id_foreign\`;`);

    this.addSql(`drop table if exists \`user\`;`);

    this.addSql(`drop table if exists \`task\`;`);
  }

}
