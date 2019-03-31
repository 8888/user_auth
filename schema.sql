--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 11.2 (Debian 11.2-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: user_auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA user_auth;


ALTER SCHEMA user_auth OWNER TO postgres;

--
-- Name: auth_id_seq; Type: SEQUENCE; Schema: user_auth; Owner: postgres
--

CREATE SEQUENCE user_auth.auth_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_auth.auth_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: auth; Type: TABLE; Schema: user_auth; Owner: postgres
--

CREATE TABLE user_auth.auth (
    id integer DEFAULT nextval('user_auth.auth_id_seq'::regclass) NOT NULL,
    salt text NOT NULL,
    token text NOT NULL,
    username text NOT NULL,
    pass_hash text NOT NULL
);


ALTER TABLE user_auth.auth OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

