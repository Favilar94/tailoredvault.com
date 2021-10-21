CREATE TABLE Plans(
	plan_id smallserial,
	description text,
	GB_storage smallint NOT NULL,
	CONSTRAINT plan_pk PRIMARY KEY(plan_id)
);
CREATE TABLE Roles(
	rol_id smallserial,
	description text,
	r_read boolean DEFAULT false,
	r_update boolean DEFAULT false,
	r_delete boolean DEFAULT false,
	r_create boolean DEFAULT false,
	sysadmin boolean DEFAULT false,
	CONSTRAINT rol_pk PRIMARY KEY (rol_id)
);
CREATE TABLE Pryvacy_Options(
	privacy_id smallserial,
	description text,
	private boolean DEFAULT false,
	friends boolean DEFAULT false,
	friends_friends boolean DEFAULT false,
	everyone boolean DEFAULT false,
	custom boolean DEFAULT false,
	CONSTRAINT privacy_pk PRIMARY KEY (privacy_id)
);

CREATE TABLE Users(
	user_id bigserial,
	member_since timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	last_conection timestamp with time zone NOT NULL,
	MB_used real,
	user_password varchar(72) NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
	email_validated boolean DEFAULT false,
	plan_id smallint NOT NULL,
	rol_id smallint NOT NULL,
	privacy_id smallint NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (user_id),
	CONSTRAINT email_uk UNIQUE (email),
	CONSTRAINT user_plan_fk FOREIGN KEY(plan_id) REFERENCES Plans(plan_id),
	CONSTRAINT user_rol_fk FOREIGN KEY(rol_id) REFERENCES Roles(rol_id),
	CONSTRAINT user_Pryvacy_fk FOREIGN KEY(privacy_id) REFERENCES Pryvacy_Options(privacy_id)
);
CREATE TABLE Relationships(
	relation_id bigserial,
	user_ID1 bigint NOT NULL,
	user_ID2 bigint NOT NULL,
	status boolean DEFAULT false,
	CONSTRAINT relation_pk PRIMARY KEY (relation_id),
	CONSTRAINT relation_uk UNIQUE (user_ID1,user_ID2),
	CONSTRAINT ID1_fk FOREIGN KEY(user_ID1) REFERENCES Users(user_id) ON DELETE CASCADE,
	CONSTRAINT ID2_fk FOREIGN KEY(user_ID2) REFERENCES Users(user_id) ON DELETE CASCADE
);
CREATE TABLE Files(
	file_id bigserial,
	file_name varchar(100) NOT NULL,
	MB_size real NOT NULL,
	file_extension varchar(10) NOT NULL,
	description text NOT NULL,
	uploaded timestamp with time zone NOT NULL,
	original_path varchar(200) NOT NULL,
	thumbnail_path varchar(200),
	spect_ratio real,
	user_id bigint NOT NULL,
	privacy_id smallint NOT NULL,
	CONSTRAINT file_pk PRIMARY KEY (photo_id),
	CONSTRAINT file_path_uk UNIQUE (original_path),
	CONSTRAINT file_thumbnail_uk UNIQUE (thumbnail_path),
	CONSTRAINT file_user_fk FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
	CONSTRAINT file_plan_fk FOREIGN KEY(privacy_id) REFERENCES Pryvacy_Options(privacy_id)
);


