USE bank;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

INSERT INTO users (username, password, role)
VALUES ('kamali', 'kamali123', 'admin');

INSERT INTO users (username, password, role)
VALUES ('ragul', 'ragul123', 'user');

INSERT INTO users (username, password, role)`
VALUES ('manikandan', 'manikandan123', 'user');

SELECT * FROM users;