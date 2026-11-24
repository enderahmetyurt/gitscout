const TEST_PACKAGES =
  /^(vitest|jest|mocha|ava|uvu|jasmine|karma|tap|cypress|playwright|@playwright\/test|@testing-library\/.+|@vitest\/.+)$/

/** JS dışındaki ekosistemler için kök dizinde test varlığını gösteren adlar. */
const TEST_ROOT_ENTRIES =
  /^(tests?|__tests__|spec|specs|e2e|cypress|conftest\.py|pytest\.ini|tox\.ini|(vitest|jest|playwright|cypress|karma)\.config\.[cm]?[jt]s)$/i

function objectKeys(value: unknown): string[] {
  return typeof value === "object" && value !== null ? Object.keys(value) : []
}

function hasTestScript(scripts: unknown): boolean {
  if (typeof scripts !== "object" || scripts === null || !("test" in scripts)) return false
  const test = scripts.test
  return typeof test === "string" && !test.includes("no test specified")
}

/** package.json bağımlılıklarına ve kök dizindeki dosya adlarına bakarak test kurulumu var mı söyler. */
export function detectTests(packageJson: string | null, rootEntries: string[]): boolean {
  if (rootEntries.some((entry) => TEST_ROOT_ENTRIES.test(entry))) return true
  if (!packageJson) return false

  let parsed: unknown
  try {
    parsed = JSON.parse(packageJson)
  } catch {
    // Bozuk package.json test kurulumu olmadığı anlamına gelir; skor için hata değil.
    return false
  }
  if (typeof parsed !== "object" || parsed === null) return false

  const dependencies = "dependencies" in parsed ? objectKeys(parsed.dependencies) : ([] as string[])
  const devDependencies =
    "devDependencies" in parsed ? objectKeys(parsed.devDependencies) : ([] as string[])
  const scripts = "scripts" in parsed ? parsed.scripts : undefined

  return (
    [...dependencies, ...devDependencies].some((name) => TEST_PACKAGES.test(name)) ||
    hasTestScript(scripts)
  )
}

const CI_FILE = /\.ya?ml$/i

export function detectCi(workflowEntries: string[]): boolean {
  return workflowEntries.some((entry) => CI_FILE.test(entry))
}
