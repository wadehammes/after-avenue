#!/usr/bin/env bash
set -euo pipefail

factory_export_name() {
  local name="$1"
  local first rest
  first=$(printf '%s' "${name:0:1}" | tr '[:upper:]' '[:lower:]')
  rest="${name:1}"
  echo "${first}${rest}Factory"
}

create_component_file() {
  touch "${component_name}.component.tsx"
  {
    echo "import styles from \"./${component_name}.module.css\";"
    echo
    echo "interface ${component_name}Props {"
    echo "  myProperty: string;"
    echo "}"
    echo
    echo "export const ${component_name} = ({ myProperty }: ${component_name}Props) => {"
    echo "  return ("
    echo "    <div className={styles.wrapper} data-testid=\"rh${component_name}\">"
    echo "      {myProperty}"
    echo "    </div>"
    echo "  );"
    echo "};"
    echo
    echo "export default ${component_name};"
  } >> "${component_name}.component.tsx"
}

create_css_module_file() {
  touch "${component_name}.module.css"
  {
    echo ".wrapper {"
    echo "  display: block;"
    echo "}"
  } >> "${component_name}.module.css"
}

create_interfaces_file() {
  touch "${component_name}.interfaces.ts"
  {
    echo "export interface ${component_name}Type {"
    echo "  id: string;"
    echo "}"
  } >> "${component_name}.interfaces.ts"
}

create_spec_file() {
  touch "${component_name}.spec.tsx"
  {
    echo "import { beforeEach, describe, expect, it } from \"@jest/globals\";"
    echo "import { ${component_name}PageObject } from \"src/components/${component_name}/${component_name}.po\";"
    echo "import { screen } from \"src/tests/test-utils\";"
    echo
    echo "describe(\"${component_name}\", () => {"
    echo "  let po: ${component_name}PageObject;"
    echo
    echo "  beforeEach(() => {"
    echo "    po = new ${component_name}PageObject();"
    echo "  });"
    echo
    echo "  it(\"renders\", () => {"
    echo "    po.render${component_name}();"
    echo "    expect(screen.getByTestId(po.testId)).toBeInTheDocument();"
    echo "  });"
    echo "});"
  } >> "${component_name}.spec.tsx"
}

create_factory_file() {
  local factory_name factory_path
  factory_name=$(factory_export_name "$component_name")
  factory_path="$repo_root/src/tests/factories/${component_name}.factory.ts"
  touch "$factory_path"
  {
    echo "import { faker } from \"@faker-js/faker\";"
    echo "import type { ${component_name}Type } from \"src/components/${component_name}/${component_name}.interfaces\";"
    echo "import { BaseFactory } from \"src/tests/factories/BaseFactory\";"
    echo "import type { KeysMatch } from \"src/types/KeysMatch\";"
    echo
    echo "type ${component_name}FactoryOptions = Record<string, never>;"
    echo
    echo "class ${component_name}Factory extends BaseFactory<"
    echo "  ${component_name}Type,"
    echo "  ${component_name}FactoryOptions"
    echo "> {"
    echo "  build("
    echo "    attributes?: Partial<${component_name}Type>,"
    echo "    _options?: ${component_name}FactoryOptions,"
    echo "  ) {"
    echo "    const instance = {"
    echo "      id: faker.string.uuid(),"
    echo "    } satisfies ${component_name}Type;"
    echo
    echo "    const factoryBuilt: ${component_name}Type = {"
    echo "      ...instance,"
    echo "      ...(attributes ?? {}),"
    echo "    };"
    echo
    echo "    const _allKeysMustBeInTheInstance: KeysMatch<"
    echo "      ${component_name}Type,"
    echo "      typeof instance"
    echo "    > = undefined;"
    echo
    echo "    return factoryBuilt;"
    echo "  }"
    echo "}"
    echo
    echo "export const ${factory_name} = new ${component_name}Factory();"
  } >> "$factory_path"
}

create_page_object_file() {
  touch "${component_name}.po.tsx"
  {
    echo "import { ${component_name} } from \"src/components/${component_name}/${component_name}.component\";"
    echo "import {"
    echo "  BasePageObject,"
    echo "  type BasePageObjectProps,"
    echo "} from \"src/tests/basePageObject.po\";"
    echo "import { render } from \"src/tests/test-utils\";"
    echo
    echo "export class ${component_name}PageObject extends BasePageObject {"
    echo "  public testId = \"rh${component_name}\";"
    echo
    echo "  constructor("
    echo "    { debug, raiseOnFind }: BasePageObjectProps = {"
    echo "      debug: false,"
    echo "      raiseOnFind: false,"
    echo "    },"
    echo "  ) {"
    echo "    super({ debug, raiseOnFind });"
    echo
    echo "    jest.resetAllMocks();"
    echo "  }"
    echo
    echo "  render${component_name}() {"
    echo "    render(<${component_name} data-testid={this.testId} myProperty=\"hello\" />);"
    echo "  }"
    echo "}"
  } >> "${component_name}.po.tsx"
}

component_name=${1:-}

if [ "$component_name" = "" ]; then
  echo "Error: component name not provided."
  echo "ex: pnpm scaffold <ComponentName>"
  exit 1
fi

dir="./src/components/${component_name}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -d "$dir" ]; then
  mkdir "$dir"
  pushd "$dir" > /dev/null
  create_component_file
  create_css_module_file
  create_interfaces_file
  create_spec_file
  create_factory_file
  create_page_object_file
  popd > /dev/null
  (cd "$repo_root" && pnpm exec biome format --write "$dir" "src/tests/factories/${component_name}.factory.ts") || true
  echo "✨ Successfully scaffolded ${component_name} ✨"
  echo "Component: src/components/${component_name}"
  echo "Factory:   src/tests/factories/${component_name}.factory.ts"
  exit 0
fi

echo "Error: ${component_name} already exists. Aborting scaffolding."
exit 1
