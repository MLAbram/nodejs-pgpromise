--
-- select * from dev.nodejs_pgpromise_data limit 99;
-- truncate table dev.nodejs_pgpromise_data restart identity;
-- drop table if exists dev.nodejs_pgpromise_data;
-- alter table dev.nodejs_pgpromise_data rename to nodejs_pgpromise_data_tmp;
create table if not exists dev.nodejs_pgpromise_data(
	nodejs_pgpromise_data_id bigint not null generated always as identity primary key,
	name_t text,
	city_t text,
	state_abbr_t text,
	latitude_n numeric(15,6),
	longitude_n numeric(15,6),

	forecast_ts timestamp(6) null,
	forecast_day_t text,
	forecast_desc_t text,
	forecast_maxtemp_f_n numeric(5,1),
	forecast_mintemp_f_n numeric(5,1),
	forecast_maxwind_mph_n numeric(5,1),
	forecast_humidity_n numeric(5,1),

	aud_src_t text,
	aud_active_f boolean default true null,
	aud_insert_dt date default current_date not null,
	aud_insert_ts timestamp(6) default current_timestamp not null,
	aud_update_ts timestamp(6) null
);

--
-- select * from dev.nodejs_pgpromise_locations limit 99;
create table if not exists dev.nodejs_pgpromise_locations(
	nodejs_pgpromise_locations_id bigint not null generated always as identity primary key,
	name_t text,
	city_t text,
	state_abbr_t text,
	latitude_n numeric(15,6),
	longitude_n numeric(15,6),

	aud_active_f boolean default true null,
	aud_insert_dt date default current_date not null,
	aud_insert_ts timestamp(6) default current_timestamp not null,
	aud_update_ts timestamp(6) null
);

insert into dev.nodejs_pgpromise_locations(name_t, city_t, state_abbr_t, latitude_n, longitude_n) values 
('Austin, TX', 'Austin', 'TX', '30.266666', '-97.733330'),
('Houston, TX', 'Houston', 'TX', '29.749907', '-95.358421'),
('San Antonio, TX', 'San Antonio', 'TX', '29.424349', '-98.491142')
;