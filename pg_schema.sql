--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dev; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA dev;


ALTER SCHEMA dev OWNER TO postgres;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: dev; Owner: postgres
--

CREATE TABLE dev."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE dev."SequelizeMeta" OWNER TO postgres;

--
-- Name: Dormitory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Dormitory" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    address text NOT NULL,
    total_rooms integer NOT NULL,
    created_by character varying(100),
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Dormitory" OWNER TO postgres;

--
-- Name: Dormitory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Dormitory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Dormitory_id_seq" OWNER TO postgres;

--
-- Name: Dormitory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Dormitory_id_seq" OWNED BY public."Dormitory".id;


--
-- Name: Maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Maintenance" (
    id integer NOT NULL,
    room_id integer NOT NULL,
    issue_description text NOT NULL,
    request_date date DEFAULT now(),
    status character varying(255) NOT NULL,
    resolved_date date,
    created_by character varying(100) NOT NULL,
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Maintenance" OWNER TO postgres;

--
-- Name: Maintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Maintenance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Maintenance_id_seq" OWNER TO postgres;

--
-- Name: Maintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Maintenance_id_seq" OWNED BY public."Maintenance".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date date NOT NULL,
    payment_status character varying(100) NOT NULL,
    payment_method character varying(100) NOT NULL,
    created_by character varying(100) NOT NULL,
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    room_allocation_id integer
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: Room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Room" (
    id integer NOT NULL,
    dormitory_id integer NOT NULL,
    room_number character varying(50) NOT NULL,
    capacity integer NOT NULL,
    current_occupancy integer DEFAULT 0,
    room_type character varying(100) NOT NULL,
    status character varying(100) NOT NULL,
    created_by character varying(100),
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    facility text,
    price real
);


ALTER TABLE public."Room" OWNER TO postgres;

--
-- Name: Room_Allocation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Room_Allocation" (
    id integer NOT NULL,
    student_id character varying(100) NOT NULL,
    room_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date,
    status character varying(100) NOT NULL,
    created_by character varying(100) NOT NULL,
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Room_Allocation" OWNER TO postgres;

--
-- Name: Room_Allocation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Room_Allocation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Room_Allocation_id_seq" OWNER TO postgres;

--
-- Name: Room_Allocation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Room_Allocation_id_seq" OWNED BY public."Room_Allocation".id;


--
-- Name: Room_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Room_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Room_id_seq" OWNER TO postgres;

--
-- Name: Room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Room_id_seq" OWNED BY public."Room".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Student" (
    id character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    gender character varying(255) NOT NULL,
    dob date NOT NULL,
    major character varying(255) NOT NULL,
    year character varying(255) NOT NULL,
    created_by character varying(100),
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status character varying,
    address text
);


ALTER TABLE public."Student" OWNER TO postgres;

--
-- Name: SysFile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SysFile" (
    id integer NOT NULL,
    "shareLink" text NOT NULL,
    type character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    created_by character varying(100) NOT NULL,
    updated_by character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."SysFile" OWNER TO postgres;

--
-- Name: SysFile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SysFile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SysFile_id_seq" OWNER TO postgres;

--
-- Name: SysFile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SysFile_id_seq" OWNED BY public."SysFile".id;


--
-- Name: Dormitory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dormitory" ALTER COLUMN id SET DEFAULT nextval('public."Dormitory_id_seq"'::regclass);


--
-- Name: Maintenance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Maintenance" ALTER COLUMN id SET DEFAULT nextval('public."Maintenance_id_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: Room id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room" ALTER COLUMN id SET DEFAULT nextval('public."Room_id_seq"'::regclass);


--
-- Name: Room_Allocation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room_Allocation" ALTER COLUMN id SET DEFAULT nextval('public."Room_Allocation_id_seq"'::regclass);


--
-- Name: SysFile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SysFile" ALTER COLUMN id SET DEFAULT nextval('public."SysFile_id_seq"'::regclass);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: dev; Owner: postgres
--

ALTER TABLE ONLY dev."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Dormitory Dormitory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dormitory"
    ADD CONSTRAINT "Dormitory_pkey" PRIMARY KEY (id);


--
-- Name: Maintenance Maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Maintenance"
    ADD CONSTRAINT "Maintenance_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Room_Allocation Room_Allocation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room_Allocation"
    ADD CONSTRAINT "Room_Allocation_pkey" PRIMARY KEY (id);


--
-- Name: Room Room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Student Student_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_email_key" UNIQUE (email);


--
-- Name: Student Student_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_phone_key" UNIQUE (phone);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: SysFile SysFile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SysFile"
    ADD CONSTRAINT "SysFile_pkey" PRIMARY KEY (id);


--
-- Name: Maintenance Maintenance_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Maintenance"
    ADD CONSTRAINT "Maintenance_room_id_fkey" FOREIGN KEY (room_id) REFERENCES public."Room"(id) ON DELETE CASCADE;


--
-- Name: Payment Payment_room_allocation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_room_allocation_id_fkey" FOREIGN KEY (room_allocation_id) REFERENCES public."Room_Allocation"(id);


--
-- Name: Room_Allocation Room_Allocation_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room_Allocation"
    ADD CONSTRAINT "Room_Allocation_room_id_fkey" FOREIGN KEY (room_id) REFERENCES public."Room"(id) ON DELETE CASCADE;


--
-- Name: Room_Allocation Room_Allocation_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room_Allocation"
    ADD CONSTRAINT "Room_Allocation_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON DELETE CASCADE;


--
-- Name: Room Room_dormitory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_dormitory_id_fkey" FOREIGN KEY (dormitory_id) REFERENCES public."Dormitory"(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

