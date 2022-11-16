import { DMMF } from '@prisma/generator-helper'

import { ApiConfig } from './_types/apiConfig'

export interface Settings {
  prismaSelectOptions?: {
    defaultFields?: {
      [key: string]:
        | { [key: string]: boolean }
        | ((select: any) => { [key: string]: boolean });
    };
    dmmf?: DMMF.Document[];
  };
  dmmf?: DMMF.Document[];
  excludeFields?: string[];
  filterInputs?: (input: DMMF.InputType) => DMMF.SchemaArg[];
  doNotUseFieldUpdateOperationsInput?: boolean;
  excludeScalar?: ('Json' | 'Decimal' | 'BigInt' | 'DateTime')[];
  apiConfig: ApiConfig
}
