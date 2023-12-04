import {defineEvent, defineTrace} from '@sanity/telemetry'

interface StartStep {
  step: 'start'
  flags: Record<string, string | number | undefined | boolean>
}

interface LoginStep {
  step: 'login'
  alreadyLoggedIn?: boolean
}
interface PrepareFlagsStep {
  step: 'prepareFlags'
}

interface GetOrCreateProjectStep {
  step: 'getOrCreateProject'
}

type InitStep = StartStep | LoginStep | PrepareFlagsStep | GetOrCreateProjectStep

export const InitProjectTelemetry = defineTrace<InitStep>({
  name: 'cliInit',
  version: 1,
  description: 'User ran the CLI init command',
})

interface SelectProjectData {
  unattended?: boolean
  created?: boolean
  coupon?: string
}

export const ProjectSelected = defineEvent<SelectProjectData | void>({
  name: 'GetOrCreateProjectTrace',
  version: 1,
  description: 'User selecting an existing project or creating a new one',
})

export const PromptProjectName = defineEvent<{step: 'complete' | 'start'}>({
  name: 'GetOrCreateProjectTrace',
  version: 1,
  description: 'User selecting an existing project or creating a new one',
})

export const SelectProject = defineEvent<
  {step: 'prompt'} | {step: 'done'; selected: 'existing' | 'new'}
>({
  name: 'GetOrCreateProjectTrace',
  version: 1,
  description: 'User selecting an existing project or creating a new one',
})

export const SelectDatasetPrompt = defineEvent<
  {step: 'prompt'} | {step: 'done'; selected: 'existing' | 'new'}
>({
  name: 'SelectDataset',
  version: 1,
  description: 'User selecting an existing dataset or creating a new one',
})

export const SelectCouponTrace = defineTrace({
  name: 'Select coupon',
  version: 1,
  description: 'User selecting a coupon',
})

export const DatasetConfigPrompt = defineEvent<
  {step: 'prompt'} | {step: 'done'; isDefault: boolean; aclMode: string}
>({
  name: 'SelectDataset',
  version: 1,
  description: 'User selecting an existing dataset or creating a new one',
})

export const TypeScriptPrompt = defineEvent<
  {step: 'prompt'} | {step: 'done'; useTypeScript: boolean}
>({
  name: 'TypeScriptPrompt',
  version: 1,
  description: 'User is asked whether to use TypeScript',
})
export const ShouldImportDataPrompt = defineEvent<
  {step: 'prompt'} | {step: 'done'; shouldImport: boolean}
>({
  name: 'TypeScriptPrompt',
  version: 1,
  description: 'User is asked whether to use TypeScript',
})

export const UseDetectedFrameworkPrompt = defineEvent<
  {step: 'prompt'} | {step: 'done'; useDetectedFramework: boolean; detectedFramework?: string}
>({
  name: 'UseDetectedFrameworkPrompt',
  version: 1,
  description: 'User is prompted whether to use the detected framework',
})

export const CreateDataset = defineTrace({
  name: 'DatasetCreate',
  version: 1,
  description: 'The API call that creates the dataset',
})
export const CreateOrAppendEnvVars = defineTrace({
  name: 'CreateOrAppendEnvVars',
  version: 1,
  description: 'CLI is creating or appending env vars',
})

export const PackageManagerPrompt = defineEvent<
  {step: 'prompt'} | {step: 'done'; selectedPackageManager: string}
>({
  name: 'PackageManagerPrompt',
  version: 1,
  description: 'User is prompted to select which package manager they wants to use',
})

export const BootstrapTemplate = defineTrace({
  name: 'BootstrapTemplate',
  version: 1,
  description: 'Bootstrapping the template process',
})
export const InstallDependencies = defineTrace({
  name: 'InstallDependencies',
  version: 1,
  description:
    'Dependencies is installed using the selected package manager. This may happen several times throughout the init process',
})

export const ImportTemplateDataset = defineTrace({
  name: 'ImportTemplateDataset',
  version: 1,
  description: 'The user has answered yes to import the data that comes with the template',
})

export const SelectTemplatePrompt = defineEvent<
  {step: 'prompt'} | {step: 'done'; selectedTemplate: string}
>({
  name: 'SelectTemplatePrompt',
  version: 1,
  description: 'User is prompted about which template to use',
})

export const SendCommunityInvitePrompt = defineEvent<
  {step: 'prompt'} | {step: 'done'; sendInvite: boolean}
>({
  name: 'SelectTemplatePrompt',
  version: 1,
  description: 'User is prompted about which template to use',
})
