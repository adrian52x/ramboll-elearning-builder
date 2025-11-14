import { Migration } from '@mikro-orm/migrations';

export class Migration20251114140843 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "blocks" ("id" uuid not null, "type" text check ("type" in ('video', 'image', 'interactive_tabs', 'flip_cards', 'feedback_activity')) not null, "headline" varchar(255) not null, "description" text null, "content" jsonb not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "blocks_pkey" primary key ("id"));`);

    this.addSql(`create table "e_learnings" ("id" uuid not null, "title" varchar(255) not null, "description" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "e_learnings_pkey" primary key ("id"));`);

    this.addSql(`create table "steps" ("id" uuid not null, "e_learning_id" uuid not null, "title" varchar(255) not null, "order_index" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "steps_pkey" primary key ("id"));`);

    this.addSql(`create table "step_blocks" ("id" uuid not null, "step_id" uuid not null, "block_id" uuid not null, "order_index" int not null, "created_at" timestamptz not null, constraint "step_blocks_pkey" primary key ("id"));`);

    this.addSql(`create table "steps_blocks" ("step_id" uuid not null, "block_id" uuid not null, constraint "steps_blocks_pkey" primary key ("step_id", "block_id"));`);

    this.addSql(`create table "e_learning_assignments" ("id" uuid not null, "universe_id" uuid not null, "e_learning_id" uuid not null, "assigned_at" timestamptz not null, constraint "e_learning_assignments_pkey" primary key ("id"));`);

    this.addSql(`alter table "steps" add constraint "steps_e_learning_id_foreign" foreign key ("e_learning_id") references "e_learnings" ("id") on update cascade;`);

    this.addSql(`alter table "step_blocks" add constraint "step_blocks_step_id_foreign" foreign key ("step_id") references "steps" ("id") on update cascade;`);
    this.addSql(`alter table "step_blocks" add constraint "step_blocks_block_id_foreign" foreign key ("block_id") references "blocks" ("id") on update cascade;`);

    this.addSql(`alter table "steps_blocks" add constraint "steps_blocks_step_id_foreign" foreign key ("step_id") references "steps" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "steps_blocks" add constraint "steps_blocks_block_id_foreign" foreign key ("block_id") references "blocks" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "e_learning_assignments" add constraint "e_learning_assignments_universe_id_foreign" foreign key ("universe_id") references "universes" ("id") on update cascade;`);
    this.addSql(`alter table "e_learning_assignments" add constraint "e_learning_assignments_e_learning_id_foreign" foreign key ("e_learning_id") references "e_learnings" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "step_blocks" drop constraint "step_blocks_block_id_foreign";`);

    this.addSql(`alter table "steps_blocks" drop constraint "steps_blocks_block_id_foreign";`);

    this.addSql(`alter table "steps" drop constraint "steps_e_learning_id_foreign";`);

    this.addSql(`alter table "e_learning_assignments" drop constraint "e_learning_assignments_e_learning_id_foreign";`);

    this.addSql(`alter table "step_blocks" drop constraint "step_blocks_step_id_foreign";`);

    this.addSql(`alter table "steps_blocks" drop constraint "steps_blocks_step_id_foreign";`);

    this.addSql(`drop table if exists "blocks" cascade;`);

    this.addSql(`drop table if exists "e_learnings" cascade;`);

    this.addSql(`drop table if exists "steps" cascade;`);

    this.addSql(`drop table if exists "step_blocks" cascade;`);

    this.addSql(`drop table if exists "steps_blocks" cascade;`);

    this.addSql(`drop table if exists "e_learning_assignments" cascade;`);
  }

}
