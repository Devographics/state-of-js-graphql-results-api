# Entities

The various `foo.yml` files containing the entities will get flattened into a single array.

In addition to any existing tags, each entity gets its containing filename as a tag. So any entity in `podcasts.yml` get the `podcasts` tag even if not explicitly specified. 

If an entity belongs to more than one category (for example Stack Overflow is both a side and a podcast) it can be stored in either file, and the missing tag can just be added manually. 