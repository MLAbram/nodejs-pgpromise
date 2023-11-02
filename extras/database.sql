--
-- select * from dev.nodejs_pgpromise limit 99;
-- truncate table dev.nodejs_pgpromise restart identity;
-- drop table dev.nodejs_pgpromise;
-- alter table dev.nodejs_pgpromise rename to nodejs_pgpromise_tmp;
create table if not exists dev.nodejs_pgpromise(
  nodejs_pgpromise_id bigint not null generated always as identity primary key,
  first_name text,
  last_name text,
  email text,
  
  aud_src_t text,
  aud_active_f boolean default true null,
  aud_insert_dt date default current_date not null,
  aud_insert_ts timestamp(6) with time zone default current_timestamp not null,
  aud_update_ts timestamp(6) with time zone null
);