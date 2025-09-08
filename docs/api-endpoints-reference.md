# WordPress API Endpoints Reference

## Base URLs

### Polything.co.uk (Primary Target)

- **Site URL**: `https://polything.co.uk`
- **REST API Base**: `https://polything.co.uk/wp-json/wp/v2`
- **Diagnostic Endpoint**: `https://polything.co.uk/wp-json/polything/v1`

### Mightybooth.com (Reference)

- **Site URL**: `https://mightybooth.com`
- **REST API Base**: `https://mightybooth.com/wp-json/wp/v2`
- **Diagnostic Endpoint**: `https://mightybooth.com/wp-json/polything/v1`

## Content Endpoints

### Posts

```
GET /wp/v2/posts
GET /wp/v2/posts/{id}
```

### Pages

```
GET /wp/v2/pages
GET /wp/v2/pages/{id}
```

### Projects (Custom Post Type)

```
GET /wp/v2/project
GET /wp/v2/project/{id}
```

### Media

```
GET /wp/v2/media
GET /wp/v2/media/{id}
```

## Themerain Diagnostic Endpoint

### Get Themerain Fields for Post

```
GET /polything/v1/themerain-meta/{post_id}
```

**Example Request**:

```bash
curl "https://polything.co.uk/wp-json/polything/v1/themerain-meta/10680"
```

**Example Response**:

```json
{
  "post_id": 10680,
  "found_keys": [
    "themerain_hero_title",
    "themerain_hero_subtitle",
    "themerain_hero_video",
    "themerain_hero_text_color"
  ],
  "meta": {
    "themerain_hero_title": "Blackriver's 297% Sales Surge",
    "themerain_hero_subtitle": "Read more about their Christmas strategy success",
    "themerain_hero_video": "10681",
    "themerain_hero_text_color": "#ffffff"
  }
}
```

## Test Post IDs

### Polything.co.uk

- **Project**: 10680 (Blackriver case study)
- **Post**: TBD
- **Page**: TBD

### Mightybooth.com

- **Project**: 1615
- **Post**: TBD
- **Page**: TBD

## Configuration

The endpoints are configured in `config/wordpress.json`:

```json
{
  "sites": {
    "polything.co.uk": {
      "url": "https://polything.co.uk",
      "apiBase": "https://polything.co.uk/wp-json/wp/v2",
      "diagnosticEndpoint": "https://polything.co.uk/wp-json/polything/v1",
      "contentTypes": ["post", "page", "project"],
      "testPostIds": {
        "project": 10680,
        "post": null,
        "page": null
      }
    }
  }
}
```
