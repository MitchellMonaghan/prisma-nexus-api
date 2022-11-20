# prisma-generator-quick-micro

> The intention of this project is the following:
> 1. Single package with prisma generator and nexus plugin
> 2. Using prisma generator, a typescript apiConfig type (based on db schema) is generated
> 3. The nexus plugin now requires this generated type as part of its settings
> 4. The plugin takes in api configuration and generates types, queries, mutations, and inputs necessary at in memory
> 5. Users can remove fields with apiConfig, and using the nexus typegen they can extend the at runtime types.

See the [/packages/usage](https://github.com/MitchellMonaghan/prisma-nexus-api/tree/main/packages/usage) for an example