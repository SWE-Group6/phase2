import * as ts from 'typescript';
import * as tsJsonSchemaGenerator from 'ts-json-schema-generator';
import * as fs from 'fs';

const program = ts.createProgram({
    rootNames: ['src/AllMetrics.ts', 'src/BusFactor.ts', 'src/Correctness.ts', 'src/License.ts', 'src/Metric.ts', 'src/Package.ts', 'src/RampUp.ts', 'src/ResponsiveMaintainer.ts'],
    options: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2015
    }
});

const schemaGenerator = tsJsonSchemaGenerator.createGenerator({
    path: 'src/AllMetrics.ts',
    tsconfig: '../tsconfig.json',
    type: 'AllMetrics'
});

const schema = schemaGenerator.createSchema('AllMetrics');
fs.writeFileSync('schema.json', JSON.stringify(schema, null, 2));
console.log('Schema generated at schema.json');
