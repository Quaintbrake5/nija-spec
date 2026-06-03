import { Generator } from './interface';
import { registerGenerator, getGenerator, listGenerators } from './registry';
import { PythonGenerator } from './python';
import { GoGenerator } from './go';
import { JavaGenerator } from './java';
import { CSharpGenerator } from './csharp';
import { PhpGenerator } from './php';
import { TypeScriptGenerator } from './typescript';

// Initialize registry
registerGenerator(new TypeScriptGenerator());
registerGenerator(new PythonGenerator());
registerGenerator(new GoGenerator());
registerGenerator(new JavaGenerator());
registerGenerator(new CSharpGenerator());
registerGenerator(new PhpGenerator());

export { Generator };
export { registerGenerator, getGenerator, listGenerators };
export { PythonGenerator };
export { GoGenerator };
export { JavaGenerator };
export { CSharpGenerator };
export { PhpGenerator };
export { TypeScriptGenerator };
