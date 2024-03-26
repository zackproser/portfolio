
## Grant a user free access to a course via email 

```sql 
-- Insert a new user if they don't exist
INSERT INTO users (name, email)
SELECT 'User Name', 'zack.p@pinecone.io'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'zack.p@pinecone.io'
);

-- Insert a new enrollment if the user is not already enrolled
INSERT INTO courseenrollments (user_id, course_id)
SELECT 
  (SELECT id FROM users WHERE email = 'zack.p@pinecone.io'),
  1
WHERE NOT EXISTS (
  SELECT 1
  FROM courseenrollments
  WHERE user_id = (SELECT id FROM users WHERE email = 'zack.p@pinecone.io')
    AND course_id = 1
); ```



INSERT INTO users (name, email)
SELECT 'Eric', 'eric@presencepg.com'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'eric@presencepg.com'
);

-- Insert a new enrollment if the user is not already enrolled
INSERT INTO courseenrollments (user_id, course_id)
SELECT 
  (SELECT id FROM users WHERE email = 'eric@presencepg.com'),
  1
WHERE NOT EXISTS (
  SELECT 1
  FROM courseenrollments
  WHERE user_id = (SELECT id FROM users WHERE email = 'eric@presencepg.com')
    AND course_id = 1
);
