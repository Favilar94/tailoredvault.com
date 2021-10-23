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
	is_personal boolean DEFAULT false,
	friends boolean DEFAULT false,
	friends_friends boolean DEFAULT false,
	everyone boolean DEFAULT false,
	CONSTRAINT privacy_pk PRIMARY KEY (privacy_id)
);
INSERT INTO Plans (description,GB_storage) 
VALUES('Plus',20), ('Basic',5), ('Free',1), ('Visitor',0);

INSERT INTO Roles (description,r_read,r_update,r_delete,r_create,sysadmin) 
VALUES ('Admin',true,true,true,true,true),
		('User',true,true,true,true,false),
		('Viewer', true,false,false,false,false)
;

INSERT INTO Pryvacy_Options(description,is_personal,friends,friends_friends,everyone) 
VALUES('Private',true, false, false, false),
	('Friends',false, true, false, false),
	('FriendsFriends',false, false, true, false),
	('Everyone',false, false, false, true)
;

CREATE TABLE Users(
	user_id bigserial,
	user_name varchar(20) NOT NULL,
	about text,
	member_since timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	last_conection timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	MB_used real,
	user_password text NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
	email_validated boolean DEFAULT false,
	plan_id smallint NOT NULL,
	rol_id smallint NOT NULL,
	privacy_id smallint NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (user_id),
	CONSTRAINT username_uk UNIQUE (user_name),
	CONSTRAINT email_uk UNIQUE (email),
	CONSTRAINT user_plan_fk FOREIGN KEY(plan_id) REFERENCES Plans(plan_id),
	CONSTRAINT user_rol_fk FOREIGN KEY(rol_id) REFERENCES Roles(rol_id),
	CONSTRAINT user_Pryvacy_fk FOREIGN KEY(privacy_id) REFERENCES Pryvacy_Options(privacy_id)
);

INSERT INTO Users (user_name,about,user_password,first_name,last_name,email,email_validated,plan_id,rol_id,privacy_id) 
VALUES ('favilar94','TailoredVaul site Owner',crypt('Cambiar123',gen_salt('bf')),'Alejandro','Favila Rivera','favilar94@gmail.com',true,1,1,1),
('Amigo','Amigo de todos',crypt('Cambiar123',gen_salt('bf')),'Amigo','De todos','amigo@gmail.com',true,2,2,4),
('Amigo2','Amigo solo de amigo',crypt('Cambiar123',gen_salt('bf')),'Amigo','De todos','amigo2@gmail.com',true,2,2,3),
('usuario1','Otro grupo de amigos',crypt('Cambiar123',gen_salt('bf')),'otros','amigos','usuario1@gmail.com',true,2,2,2),
('usuario2','Otro grupo de amigos',crypt('Cambiar123',gen_salt('bf')),'otros','amigos','usuario2@gmail.com',true,2,2,4)
;

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
	uploaded timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	original_path varchar(200) NOT NULL,
	thumbnail_path varchar(200),
	spect_ratio real,
	user_id bigint NOT NULL,
	privacy_id smallint NOT NULL,
	CONSTRAINT file_pk PRIMARY KEY (file_id),
	CONSTRAINT file_path_uk UNIQUE (original_path),
	CONSTRAINT file_thumbnail_uk UNIQUE (thumbnail_path),
	CONSTRAINT file_user_fk FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
	CONSTRAINT file_privacy_plan_fk FOREIGN KEY(privacy_id) REFERENCES Pryvacy_Options(privacy_id)
);
INSERT INTO Relationships(user_ID1,user_ID2,status) VALUES (1,2,true),(2,1,true),(2,3,true),(3,2,true),(4,5,true),(5,4,true);

SELECT * FROM plans;
SELECT * FROM roles;
SELECT * FROM pryvacy_options

SELECT * FROM files;
SELECT * FROM relationships;
SELECT * FROM users;


	
	
