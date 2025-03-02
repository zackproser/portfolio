-- Create the free_chapter_requests table
CREATE TABLE IF NOT EXISTS free_chapter_requests (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    product_slug VARCHAR(255) NOT NULL,
    request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    fulfilled BOOLEAN NOT NULL DEFAULT FALSE,
    fulfilled_date TIMESTAMP WITH TIME ZONE,
    UNIQUE(email, product_slug)
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_free_chapter_requests_email ON free_chapter_requests(email);
CREATE INDEX IF NOT EXISTS idx_free_chapter_requests_product_slug ON free_chapter_requests(product_slug); 