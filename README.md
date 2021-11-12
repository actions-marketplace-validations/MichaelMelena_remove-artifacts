# MichaelMelena/remove-artifacts@v1
removes artifacts in repository

# Inputs & Outputs
Thhis action by default uses the repository from which it was called. You can provide your own token in order to access other repositories than the one which triggered the workflow.

Default token is [automaticly created token](https://docs.github.com/en/actions/security-guides/automatic-token-authentication) and stored in secrets and can be acces via secrets `${{ secrets.GITHUB_TOKEN}}` or from github context `${{ github.token }}`.

### Inputs:

| parameter  | required |       default       | description |
| :--------- | :------: | :-----------------: | :---------- |
| GITHUB_TOKEN    |   :x:    | ${{ github.token }} | you can specify your own token. Make sure the token has the permissions to GitHub API endpoint  `DELETE /repos/{owner}/{repo}/actions/artifacts/{atrifact_id}`. As of right now when you create Personal access token (PAT) you have to enable workflow permission |
| repository |   :x:    | ${{ github.token }} | you can specify different repository in format `owner/repositry` for example `MichaelMelena/remove-artifacts` for this repository
| artifacts | :heavy_check_mark: | :x: | You can you result returned from [MichaelMelena/list-artifacts@v1](https://github.com/MichaelMelena/list-artifacts#readme). or you can provide your own list of `JSON` objects with property `{id:1}` with the id of the artifact you wish to delete. For more information see [Advanced template](#advanced-template)   |

\* *make sure your token matches your repository*

### Outputs:
this action doesn't have outputs

## Starter template
this workflow uses my other GitHub Action which retrieves list of artifacts. And then removes all of those artifacts.
This example should run in any repository

```yml
name: Starter remove
on: [workflow_dispatch]
jobs:
  remove-job:
    runs-on: ubuntu-latest
    steps:
    - id: result 
      uses: MichaelMelena/list-artifacts@v1
    - uses: MichaelMelena/remove-artifacts@v1
      with:
        artifacts: ${{ steps.result.outputs.artifacts }}
```

## Advanced template
you can specify which artifact you wish to remove
by providing a list in folowing format:
```JSON
[
  { "id" : 1},
  { "id" : 2}
]
```

the property `id` refers to artifact id. Any other properties are ignored

This is the template using your own values: 
```YML
name: Advanced remove
on: [workflow_dispatch]
jobs:
  remove-job:
    runs-on: ubuntu-latest
    steps:
      - uses: MichaelMelena/remove-artifacts@v1
        with:
          artifacts: '[{"id":1},{"id":2}]'

```
