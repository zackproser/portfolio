# EmailOctopus Tagging Infrastructure

This document explains the EmailOctopus tagging infrastructure that allows you to track subscriber interactions and segment your audience based on their behavior.

## Overview

The system consists of a redirector API route (`/api/click`) that:
1. Reads subscriber email and intent tags from query parameters
2. Upserts those tags onto the EmailOctopus contact via the API
3. Redirects the user to their chosen destination

## API Route: `/api/click`

### Query Parameters

- `e` - Subscriber email address (use `{{EmailAddress}}` merge tag in EmailOctopus)
- `tag` - One or many tag parameters (can be repeated for multiple tags)
- `r` - Redirect URL (optional; falls back to `CLICK_REDIRECT_DEFAULT`)
- `f` - Final URL alias (optional, for prettiness; ignored if `r` present)

### Examples

```
/api/click?e={{EmailAddress}}&tag=intent:build&r=https://zackproser.com/ai/build
/api/click?e={{EmailAddress}}&tag=intent:strategy&tag=blog:clicked&r=https://zackproser.com/insights
/api/click?e={{EmailAddress}}&tag=intent:build&tag=source:seg-email-1
```

## Environment Variables

Set these in your environment:

```bash
EMAIL_OCTOPUS_API_KEY=your_api_key_here
EMAIL_OCTOPUS_LIST_ID=your_list_id_here
CLICK_REDIRECT_DEFAULT=https://zackproser.com/thanks  # optional
```

## How to Use in EmailOctopus

### 1. Create Email Links

Point your email buttons/links to your site with the subscriber merge and intent tags:

```
https://yourdomain.com/api/click?e={{EmailAddress}}&tag=intent:build&r=https://yourdomain.com/build-ai
https://yourdomain.com/api/click?e={{EmailAddress}}&tag=intent:apply&r=https://yourdomain.com/apply-ai
https://yourdomain.com/api/click?e={{EmailAddress}}&tag=intent:strategy&r=https://yourdomain.com/insights
```

### 2. Stack Tags for Segmentation

You can stack multiple tags for deeper segmentation:

```
/api/click?e={{EmailAddress}}&tag=intent:build&tag=source:seg-email-1&tag=newsletter:ai
```

### 3. Tag Semantics

The system uses EmailOctopus API semantics:
- **Create contacts**: `tags: ["tag1", "tag2"]`
- **Update contacts**: `tags: { "tag1": true, "tag2": false }`

## Testing

### Development Test Endpoint

Use `/api/click/test` in development mode to test the configuration:

```
http://localhost:3000/api/click/test?email=test@example.com&tag=intent:build&tag=newsletter:ai
```

This will show you:
- The generated click URL
- Environment variable status
- Tag processing

### Manual Testing

1. Set up your environment variables
2. Start your development server
3. Visit the test endpoint to verify configuration
4. Test the actual click endpoint with sample data

## Implementation Details

### Error Handling

The system is designed to never break the user journey:
- If EmailOctopus API fails, users are still redirected
- If email is missing, users are redirected to the default URL
- All errors are handled gracefully

### Contact Management

The system handles both scenarios:
1. **Existing contacts**: Updates tags via PUT request
2. **New contacts**: Creates contact with tags via POST request

### Security Considerations

- Email addresses are passed in query strings (exposed in logs)
- For production, consider implementing signed tokens
- The system prioritizes user experience over perfect security

## Future Enhancements

Consider adding:
- HMAC signature verification
- Helper functions to generate links from config objects
- Analytics tracking
- Rate limiting
- Logging and monitoring

## Troubleshooting

### Common Issues

1. **500 Error**: Check environment variables are set
2. **Redirect not working**: Verify the redirect URL is valid
3. **Tags not updating**: Check EmailOctopus API key and list ID
4. **Contact not found**: System will create new contact automatically

### Debug Mode

Set `NODE_ENV=development` to enable debug logging and test endpoints.
