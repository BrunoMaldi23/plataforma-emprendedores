-- Esquema inicial de NEXORA (fase 1: lectura pública de catálogo y oportunidades).

CREATE TABLE category (
    id          VARCHAR(40)  PRIMARY KEY,
    name        VARCHAR(80)  NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE business (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug          VARCHAR(100) NOT NULL UNIQUE,
    name          VARCHAR(120) NOT NULL,
    tagline       VARCHAR(200) NOT NULL,
    description   TEXT         NOT NULL,
    category_id   VARCHAR(40)  NOT NULL REFERENCES category (id),
    location      VARCHAR(80)  NOT NULL,
    contact_email VARCHAR(160) NOT NULL,
    instagram     VARCHAR(80),
    founded_year  INTEGER      NOT NULL,
    status        VARCHAR(20)  NOT NULL CHECK (status IN ('APPROVED', 'PENDING', 'HIDDEN'))
);
CREATE INDEX idx_business_category ON business (category_id);
CREATE INDEX idx_business_status ON business (status);

CREATE TABLE business_tag (
    business_id BIGINT      NOT NULL REFERENCES business (id) ON DELETE CASCADE,
    tag         VARCHAR(60) NOT NULL,
    PRIMARY KEY (business_id, tag)
);

CREATE TABLE offering (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    business_id BIGINT       NOT NULL REFERENCES business (id) ON DELETE CASCADE,
    kind        VARCHAR(10)  NOT NULL CHECK (kind IN ('PRODUCT', 'SERVICE')),
    name        VARCHAR(120) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price_clp   INTEGER CHECK (price_clp >= 0)
);
CREATE INDEX idx_offering_business ON offering (business_id);

CREATE TABLE opportunity (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug         VARCHAR(100) NOT NULL UNIQUE,
    title        VARCHAR(160) NOT NULL,
    type         VARCHAR(20)  NOT NULL CHECK (type IN ('FERIA', 'CAPACITACION', 'PROGRAMA', 'FONDO', 'CONVOCATORIA')),
    summary      VARCHAR(255) NOT NULL,
    description  TEXT         NOT NULL,
    organization VARCHAR(160) NOT NULL,
    start_date   DATE         NOT NULL,
    deadline     DATE,
    url          VARCHAR(255) NOT NULL,
    status       VARCHAR(20)  NOT NULL CHECK (status IN ('OPEN', 'UPCOMING', 'CLOSED')),
    published    BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE opportunity_requirement (
    opportunity_id BIGINT       NOT NULL REFERENCES opportunity (id) ON DELETE CASCADE,
    position       INTEGER      NOT NULL,
    text           VARCHAR(255) NOT NULL,
    PRIMARY KEY (opportunity_id, position)
);
