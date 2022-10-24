create table "client" (
	"id" serial primary key, 
	"email" varchar(64) unique
);

create table "vehicle" (
	"id" serial primary key, 
	"plate_number" varchar(16) not null unique, 
	"model" varchar(256), 
	"client_id" integer not null references client("id")
		on delete cascade
);

create type "service_type_enum" AS enum('FuelDelivery', 'Maintenance', 'Fine', 'Parking', 'GasStation');

create table "vehicle_service" (
	"id" serial primary key, 
	"service_type" "service_type_enum" not null, 
	"vehicle_id" integer not null references vehicle("id")
		on delete cascade, 
	unique ("service_type", "vehicle_id")); 

create table "vehicle_service_data"(
	"id" serial primary key, 
	"vehicle_service_id" integer not null references vehicle_service("id")
		on delete cascade, 
	"data" jsonb not null,
	"created_at" TIMESTAMP WITH TIME zone not null default now()
);

insert into client ("email") values 
	('test1@mail.ru'); -- for test purposes