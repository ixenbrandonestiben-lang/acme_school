CREATE TABLE identification_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(6) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(250)
);

CREATE TABLE cities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(14) NOT NULL,
    firstName VARCHAR(60) NOT NULL,
    lastName VARCHAR(60) NOT NULL,
    identification_type_id INT NOT NULL,
    identificationNumber VARCHAR(16) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    birthdate DATETIME NOT NULL,
    email VARCHAR(60) NOT NULL,
    address VARCHAR(100) NOT NULL,
    city_id BIGINT NOT NULL,
    FOREIGN KEY (identification_type_id) REFERENCES identification_types(id),
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE teachers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(60) NOT NULL,
    lastName VARCHAR(60) NOT NULL,
    identification_type_id INT NOT NULL,
    identificationNumber VARCHAR(16) NOT NULL,
    email VARCHAR(100) NOT NULL,
    FOREIGN KEY (identification_type_id) REFERENCES identification_types(id)
);

CREATE TABLE classrooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) NOT NULL,
    description VARCHAR(250),
    capacity INT NOT NULL,
    active TINYINT NOT NULL
);

CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) NOT NULL,
    description VARCHAR(250),
    intensity INT NOT NULL,
    weight INT NOT NULL,
    active TINYINT NOT NULL
);

CREATE TABLE topics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    code VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(250),
    active TINYINT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE courses_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    classroom_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    active TINYINT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
);

CREATE TABLE inscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_schedule BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    register_date DATETIME NOT NULL,
    active TINYINT NOT NULL,
    FOREIGN KEY (course_schedule) REFERENCES courses_schedules(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE rates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    inscription_id BIGINT NOT NULL,
    rate BIGINT NOT NULL,
    comments VARCHAR(250),
    FOREIGN KEY (inscription_id) REFERENCES inscriptions(id)
);
