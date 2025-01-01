--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10
-- Dumped by pg_dump version 17.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: course_status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.course_status AS ENUM (
    'coming-soon',
    'in-progress',
    'available'
);


ALTER TYPE public.course_status OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    type character varying(255) NOT NULL,
    provider character varying(255) NOT NULL,
    "providerAccountId" character varying(255) NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    id_token text,
    scope text,
    session_state text,
    token_type text
);


ALTER TABLE public.accounts OWNER TO "default";

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_id_seq OWNER TO "default";

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: articlepurchases; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.articlepurchases (
    purchase_id integer NOT NULL,
    user_id integer,
    article_slug character varying(255),
    purchase_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_id character varying(255),
    amount numeric(10,2)
);


ALTER TABLE public.articlepurchases OWNER TO "default";

--
-- Name: articlepurchases_purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.articlepurchases_purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.articlepurchases_purchase_id_seq OWNER TO "default";

--
-- Name: articlepurchases_purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.articlepurchases_purchase_id_seq OWNED BY public.articlepurchases.purchase_id;


--
-- Name: courseenrollments; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.courseenrollments (
    enrollment_id integer NOT NULL,
    user_id integer,
    course_id integer,
    enrollment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.courseenrollments OWNER TO "default";

--
-- Name: courseenrollments_enrollment_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.courseenrollments_enrollment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courseenrollments_enrollment_id_seq OWNER TO "default";

--
-- Name: courseenrollments_enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.courseenrollments_enrollment_id_seq OWNED BY public.courseenrollments.enrollment_id;


--
-- Name: coursepurchases; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.coursepurchases (
    purchase_id integer NOT NULL,
    user_id integer,
    course_slug character varying(255),
    purchase_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_id character varying(255),
    amount numeric(10,2)
);


ALTER TABLE public.coursepurchases OWNER TO "default";

--
-- Name: coursepurchases_purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.coursepurchases_purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coursepurchases_purchase_id_seq OWNER TO "default";

--
-- Name: coursepurchases_purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.coursepurchases_purchase_id_seq OWNED BY public.coursepurchases.purchase_id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.courses (
    course_id integer NOT NULL,
    title character varying(255),
    description text,
    slug character varying(255),
    status public.course_status,
    price_id character varying(255)
);


ALTER TABLE public.courses OWNER TO "default";

--
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_course_id_seq OWNER TO "default";

--
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- Name: email_notifications; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.email_notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    content_type character varying(50) NOT NULL,
    content_slug character varying(255) NOT NULL,
    email_type character varying(50) NOT NULL,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_notifications_content_type_check CHECK (((content_type)::text = ANY ((ARRAY['article'::character varying, 'course'::character varying])::text[])))
);


ALTER TABLE public.email_notifications OWNER TO "default";

--
-- Name: email_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.email_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_notifications_id_seq OWNER TO "default";

--
-- Name: email_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.email_notifications_id_seq OWNED BY public.email_notifications.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    expires timestamp with time zone NOT NULL,
    "sessionToken" character varying(255) NOT NULL
);


ALTER TABLE public.sessions OWNER TO "default";

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO "default";

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: stripepayments; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.stripepayments (
    payment_id integer NOT NULL,
    user_id integer,
    stripe_payment_id character varying(255),
    amount numeric(10,2),
    payment_status character varying(50),
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stripepayments OWNER TO "default";

--
-- Name: stripepayments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.stripepayments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stripepayments_payment_id_seq OWNER TO "default";

--
-- Name: stripepayments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.stripepayments_payment_id_seq OWNED BY public.stripepayments.payment_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    "emailVerified" timestamp with time zone,
    image text,
    github_username character varying(255),
    avatar_url text,
    followers_count integer
);


ALTER TABLE public.users OWNER TO "default";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "default";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: verification_token; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.verification_token (
    identifier text NOT NULL,
    expires timestamp with time zone NOT NULL,
    token text NOT NULL
);


ALTER TABLE public.verification_token OWNER TO "default";

--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: articlepurchases purchase_id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.articlepurchases ALTER COLUMN purchase_id SET DEFAULT nextval('public.articlepurchases_purchase_id_seq'::regclass);


--
-- Name: courseenrollments enrollment_id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.courseenrollments ALTER COLUMN enrollment_id SET DEFAULT nextval('public.courseenrollments_enrollment_id_seq'::regclass);


--
-- Name: coursepurchases purchase_id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.coursepurchases ALTER COLUMN purchase_id SET DEFAULT nextval('public.coursepurchases_purchase_id_seq'::regclass);


--
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- Name: email_notifications id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.email_notifications ALTER COLUMN id SET DEFAULT nextval('public.email_notifications_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: stripepayments payment_id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stripepayments ALTER COLUMN payment_id SET DEFAULT nextval('public.stripepayments_payment_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: articlepurchases articlepurchases_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.articlepurchases
    ADD CONSTRAINT articlepurchases_pkey PRIMARY KEY (purchase_id);


--
-- Name: articlepurchases articlepurchases_user_id_article_slug_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.articlepurchases
    ADD CONSTRAINT articlepurchases_user_id_article_slug_key UNIQUE (user_id, article_slug);


--
-- Name: courseenrollments courseenrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.courseenrollments
    ADD CONSTRAINT courseenrollments_pkey PRIMARY KEY (enrollment_id);


--
-- Name: courseenrollments courseenrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.courseenrollments
    ADD CONSTRAINT courseenrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: coursepurchases coursepurchases_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.coursepurchases
    ADD CONSTRAINT coursepurchases_pkey PRIMARY KEY (purchase_id);


--
-- Name: coursepurchases coursepurchases_user_id_course_slug_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.coursepurchases
    ADD CONSTRAINT coursepurchases_user_id_course_slug_key UNIQUE (user_id, course_slug);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- Name: email_notifications email_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_pkey PRIMARY KEY (id);


--
-- Name: email_notifications email_notifications_user_id_content_type_content_slug_email_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_user_id_content_type_content_slug_email_key UNIQUE (user_id, content_type, content_slug, email_type);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: stripepayments stripepayments_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stripepayments
    ADD CONSTRAINT stripepayments_pkey PRIMARY KEY (payment_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_token verification_token_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.verification_token
    ADD CONSTRAINT verification_token_pkey PRIMARY KEY (identifier, token);


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: articlepurchases articlepurchases_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.articlepurchases
    ADD CONSTRAINT articlepurchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: courseenrollments courseenrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.courseenrollments
    ADD CONSTRAINT courseenrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id);


--
-- Name: courseenrollments courseenrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.courseenrollments
    ADD CONSTRAINT courseenrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: coursepurchases coursepurchases_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.coursepurchases
    ADD CONSTRAINT coursepurchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: email_notifications email_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: stripepayments stripepayments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stripepayments
    ADD CONSTRAINT stripepayments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

