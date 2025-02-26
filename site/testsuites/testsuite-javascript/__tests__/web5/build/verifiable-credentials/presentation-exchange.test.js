import { test, describe, expect } from 'vitest';

import {
  pex_createPresentationFromCredentials,
  pex_getLoanAppPresentationDefinition,
  pex_submissionCheck,
} from '../../../../../../code-snippets/web5/build/verifiable-credentials/presentation-exchange';
import { PresentationExchange } from '@web5/credentials';

const pd = await pex_getLoanAppPresentationDefinition();

describe('Presentation Exchange Process', () => {
  const signedEmploymentVcJwt =
    'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejZNa2VyNDlDbnVnN2hzdkhEZ3Y0NHl2cGR2dE1oNHlMaURYeFM2N2huclVodHQyI3o2TWtlcjQ5Q251Zzdoc3ZIRGd2NDR5dnBkdnRNaDR5TGlEWHhTNjdobnJVaHR0MiJ9.eyJpc3MiOiJkaWQ6a2V5Ono2TWtlcjQ5Q251Zzdoc3ZIRGd2NDR5dnBkdnRNaDR5TGlEWHhTNjdobnJVaHR0MiIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJFbXBsb3ltZW50Q3JlZGVudGlhbCJdLCJpZCI6InVybjp1dWlkOjcyNDhiOTkyLTkwOTYtNDk2NS1hMGVjLTc3ZDhhODNhMWRmYiIsImlzc3VlciI6ImRpZDprZXk6ejZNa2VyNDlDbnVnN2hzdkhEZ3Y0NHl2cGR2dE1oNHlMaURYeFM2N2huclVodHQyIiwiaXNzdWFuY2VEYXRlIjoiMjAyMy0xMi0yMVQyMDoxMToyNVoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDppb246RWlEMTR4UmY0cTJNWlh1ZWY2X2ZXYnBGbVlTUG94dGFxTkp1SmdEMG96Wl84UTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaWVubGFNbVYzTlhKeVVXdFVjbUV3WlZsVk16WlBTblJzTURCbFJWZHhhalZhV0dkNmNEZFpSVTVKUVNKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZTeDdJbWxrSWpvaVpIZHVMV1Z1WXlJc0luQjFZbXhwWTB0bGVVcDNheUk2ZXlKamNuWWlPaUp6WldOd01qVTJhekVpTENKcmRIa2lPaUpGUXlJc0luZ2lPaUpQZDJZMFQyMUViamxKWm5SNFdYWnBkRTFHWm1jMVVXeDVMVVV6VWs1b1dsUkdPVlpFTWtnNVQzVjNJaXdpZVNJNkltUnZjVmxtV2s1c1NtRlRNVll4U201bU9HdEZObEF6VkRsd2QzaDNla3hFVTJWc1ZqTlRUa2s1U2xFaWZTd2ljSFZ5Y0c5elpYTWlPbHNpYTJWNVFXZHlaV1Z0Wlc1MElsMHNJblI1Y0dVaU9pSktjMjl1VjJWaVMyVjVNakF5TUNKOVhTd2ljMlZ5ZG1salpYTWlPbHQ3SW1sa0lqb2laSGR1SWl3aWMyVnlkbWxqWlVWdVpIQnZhVzUwSWpwN0ltVnVZM0o1Y0hScGIyNUxaWGx6SWpwYklpTmtkMjR0Wlc1aklsMHNJbTV2WkdWeklqcGJJbWgwZEhCek9pOHZaSGR1TG5SaVpHUmxkaTV2Y21jdlpIZHVOaUlzSW1oMGRIQnpPaTh2WkhkdUxuUmlaR1JsZGk1dmNtY3ZaSGR1TUNKZExDSnphV2R1YVc1blMyVjVjeUk2V3lJalpIZHVMWE5wWnlKZGZTd2lkSGx3WlNJNklrUmxZMlZ1ZEhKaGJHbDZaV1JYWldKT2IyUmxJbjFkZlgxZExDSjFjR1JoZEdWRGIyMXRhWFJ0Wlc1MElqb2lSV2xEWm05bVFUQkpVbU5uY2tWdVVHZHdRbU5RV1ZsV2VFWlliR0pTYjJRd2RVNWZRVkJwTkVrNUxVRmZRU0o5TENKemRXWm1hWGhFWVhSaElqcDdJbVJsYkhSaFNHRnphQ0k2SWtWcFFtd3pWWG80VldGT2REZGxlREJKYjJJMFJFNXNhbFJGVmpaelQwTmtjbFJ3TWxvNE5FTkJPVFJPUWtFaUxDSnlaV052ZG1WeWVVTnZiVzFwZEcxbGJuUWlPaUpGYVVOWk9WRldZbWRKYkUxemRraEZYMVJtTld4a1MxQjBkR3d3WVV4blNrdHNSbmt6Vms0d2QzQTJhVFpSSW4xOSIsImVtcGxveW1lbnRTdGF0dXMiOiJlbXBsb3llZCJ9fX0.Sazc8Ndhs-NKjxvtVMKeC9dxjEkI26fVsp2kFNWM-SYLtxMzKvl5ffeWd81ysHgPmBBSk2ar4dMqGgUsyM4gAQ';
  const signedNameAndDobVcJwt =
    'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejZNa2pwUzRHVUFoYmdCSmg2azJnZTZvWTQ0UUxyRXA3NXJadHNqYVRLb3JSRGR0I3o2TWtqcFM0R1VBaGJnQkpoNmsyZ2U2b1k0NFFMckVwNzVyWnRzamFUS29yUkRkdCJ9.eyJpc3MiOiJkaWQ6a2V5Ono2TWtqcFM0R1VBaGJnQkpoNmsyZ2U2b1k0NFFMckVwNzVyWnRzamFUS29yUkRkdCIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJOYW1lQW5kRG9iQ3JlZGVudGlhbCJdLCJpZCI6InVybjp1dWlkOjliZjM2YzY5LTI0ODAtNDllZC1iMTYyLTRlZDEwOWE3MTc3NyIsImlzc3VlciI6ImRpZDprZXk6ejZNa2pwUzRHVUFoYmdCSmg2azJnZTZvWTQ0UUxyRXA3NXJadHNqYVRLb3JSRGR0IiwiaXNzdWFuY2VEYXRlIjoiMjAyMy0xMi0yMVQyMDowNjowMVoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDppb246RWlDS2o2M0FyZlBGcEpsb2lTd3gxQUhxVWtpWlNoSDZGdnZoSzRaTl9fZDFtQTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUprZDI0dGMybG5JaXdpY0hWaWJHbGpTMlY1U25kcklqcDdJbU55ZGlJNklrVmtNalUxTVRraUxDSnJkSGtpT2lKUFMxQWlMQ0o0SWpvaWNscFdXbTVJVkVrNWFEWkJUVmxVV0dwT01HcFhTVkYwTTI5ak4xTnJTeTF4Y2kxcVVuSTBUalEzUlNKOUxDSndkWEp3YjNObGN5STZXeUpoZFhSb1pXNTBhV05oZEdsdmJpSmRMQ0owZVhCbElqb2lTbk52YmxkbFlrdGxlVEl3TWpBaWZTeDdJbWxrSWpvaVpIZHVMV1Z1WXlJc0luQjFZbXhwWTB0bGVVcDNheUk2ZXlKamNuWWlPaUp6WldOd01qVTJhekVpTENKcmRIa2lPaUpGUXlJc0luZ2lPaUpaVDFwRE5WSmlUMHQ1T0dadVVUWTJVWEZPUkc5aldFMXZPVXhUZEdNNVYyOWthMHd0ZFZCZlExQnZJaXdpZVNJNklsWnZZM0UxVERodFozQlhXVTFrYjFwS1JrWlJUa1ZDT0hsR0xXTndkRWQzZFdkcFRWVm5hR2t6Y21jaWZTd2ljSFZ5Y0c5elpYTWlPbHNpYTJWNVFXZHlaV1Z0Wlc1MElsMHNJblI1Y0dVaU9pSktjMjl1VjJWaVMyVjVNakF5TUNKOVhTd2ljMlZ5ZG1salpYTWlPbHQ3SW1sa0lqb2laSGR1SWl3aWMyVnlkbWxqWlVWdVpIQnZhVzUwSWpwN0ltVnVZM0o1Y0hScGIyNUxaWGx6SWpwYklpTmtkMjR0Wlc1aklsMHNJbTV2WkdWeklqcGJJbWgwZEhCek9pOHZaSGR1TG5SaVpHUmxkaTV2Y21jdlpIZHVOaUlzSW1oMGRIQnpPaTh2WkhkdUxuUmlaR1JsZGk1dmNtY3ZaSGR1TUNKZExDSnphV2R1YVc1blMyVjVjeUk2V3lJalpIZHVMWE5wWnlKZGZTd2lkSGx3WlNJNklrUmxZMlZ1ZEhKaGJHbDZaV1JYWldKT2IyUmxJbjFkZlgxZExDSjFjR1JoZEdWRGIyMXRhWFJ0Wlc1MElqb2lSV2xCTXpSMlMzb3llVmswZVV4dGRDMUdabkJuYWpWbGFFRm1ZWFI1YzFOa2MwNVNWbVpMYkhwUWRqTjVkeUo5TENKemRXWm1hWGhFWVhSaElqcDdJbVJsYkhSaFNHRnphQ0k2SWtWcFF6ZGZjMXBzTW1wMVVXNUdhRVJIV1RSb2NFVTRiMlF4YVU5MWRuZG1PVFJ5TVVkbk9HMWFWbVJCVmxFaUxDSnlaV052ZG1WeWVVTnZiVzFwZEcxbGJuUWlPaUpGYVVKdU5sTnJiSEpWYzNKdVFuaFJPVXBqVXkxTlNVaGtWelYwTXpRM1MxWjNaMXBwVEZwMFQwcDRRVkYzSW4xOSIsIm5hbWUiOiJhbGljZSBib2IiLCJkYXRlT2ZCaXJ0aCI6IjEwLTAxLTE5OTAifX19.mNCDv_JntH-wZpYONKNL58UbOWaYXCYJO_HPI_WVlSgwzo6dhYmV_9qtpFKd_exFb-aaEYPeSE43twWlrJeSBg';
  const credentials = [signedEmploymentVcJwt, signedNameAndDobVcJwt];
 

  const presentationDefinition = {
    id: 'presDefIdloanAppVerification123',
    name: 'Loan Application Employment Verification',
    purpose: 'To verify applicant’s employment, date of birth, and name',
    input_descriptors: [
      // Employment Verification
      {
        id: 'employmentVerification',
        purpose: 'Confirm current employment status',
        constraints: {
          fields: [
            {
              path: ['$.credentialSubject.employmentStatus'],
              filter: {
                type: 'string',
                pattern: 'employed',
              },
            },
          ],
        },
      },
      // Date of Birth Verification
      {
        id: 'dobVerification',
        purpose: 'Confirm the applicant’s date of birth',
        constraints: {
          fields: [
            {
              path: ['$.credentialSubject.dateOfBirth'],
              filter: {
                type: 'string',
                format: 'date',
              },
            },
          ],
        },
      },
      // Name Verification
      {
        id: 'nameVerification',
        purpose: 'Confirm the applicant’s legal name',
        constraints: {
          fields: [
            {
              path: ['$.credentialSubject.name'],
              filter: {
                type: 'string'
              }
            }
          ]
        }
      }
    ]
  };
  
  test('getLoanAppPresentationDefinition returns a presentation definition', async () => {
    // :snippet-start: getLoanAppPresentationDefinition
    const presentationDefinition = {
      id: 'presDefIdloanAppVerification123',
      name: 'Loan Application Employment Verification',
      purpose: 'To verify applicant’s employment, date of birth, and name',
      input_descriptors: [
        // Employment Verification
        {
          id: 'employmentVerification',
          purpose: 'Confirm current employment status',
          constraints: {
            fields: [
              {
                path: ['$.credentialSubject.employmentStatus'],
                filter: {
                  type: 'string',
                  pattern: 'employed',
                },
              },
            ],
          },
        },
        // Date of Birth Verification
        {
          id: 'dobVerification',
          purpose: 'Confirm the applicant’s date of birth',
          constraints: {
            fields: [
              {
                path: ['$.credentialSubject.dateOfBirth'],
                filter: {
                  type: 'string',
                  format: 'date',
                },
              },
            ],
          },
        },
        // Name Verification
        {
          id: 'nameVerification',
          purpose: 'Confirm the applicant’s legal name',
          constraints: {
            fields: [
              {
                path: ['$.credentialSubject.name'],
                filter: {
                  type: 'string'
                }
              }
            ]
          }
        }
      ]
    };
    // :snippet-end:
    expect(presentationDefinition).toBeDefined();
    expect(presentationDefinition).toHaveProperty('input_descriptors');
    expect(presentationDefinition.input_descriptors).toBeInstanceOf(Array);
    expect(presentationDefinition.input_descriptors.length).toBe(3);
  });
  test('selectCredentialsForPex selects VCs that match presentation defintion', async () => {
    const allCredentials = credentials
    // :snippet-start: selectCredentialsForPex
    const selectedCredentials = PresentationExchange.selectCredentials({
      vcJwts: allCredentials,
      presentationDefinition: presentationDefinition
    });
    // :snippet-end:
    
    expect(selectedCredentials).toBeDefined();
    expect(selectedCredentials).toBeInstanceOf(Array);
    expect.soft(selectedCredentials.length).toBe(2);
    expect.soft(selectedCredentials).toContain(signedEmploymentVcJwt);
    expect.soft(selectedCredentials).toContain(signedNameAndDobVcJwt);
  });

  test('satisfiesPresentationDefinitionForPex checks if VCs satisfy PD', async () => {
    const selectedCredentials = credentials
    expect(() => {
    // :snippet-start: satisfiesPresentationDefinitionForPex
    try {
      PresentationExchange.satisfiesPresentationDefinition({
        vcJwts: selectedCredentials,
        presentationDefinition: presentationDefinition
      });
    } catch (err) {
      //Handle errors here

    }
    // :snippet-end:
    }).not.toThrow();
  });

  test('createPresentationFromCredentialsForPex creates a presentation result', async () => {
    const selectedCredentials = credentials
    // :snippet-start: createPresentationFromCredentialsForPex
    const presentationResult = PresentationExchange.createPresentationFromCredentials({
      vcJwts: selectedCredentials,
      presentationDefinition: presentationDefinition
    });
    // :snippet-end:
    expect(presentationResult).toBeDefined();
    expect(presentationResult).toHaveProperty('presentation');
    expect(presentationResult.presentation).toHaveProperty('presentation_submission');
    expect(presentationResult.presentation).toHaveProperty('verifiableCredential');
    expect(presentationResult.presentation.type).toContain('VerifiablePresentation');
    }
  );

  test('validPresentationSubmissionForPex check if the presention submission is valid', async () => {
    const presentationResult = await pex_createPresentationFromCredentials(credentials, pd);
    // :snippet-start: validPresentationSubmissionForPex
    const submissionCheck = PresentationExchange.validateSubmission({
      presentationSubmission: presentationResult.presentationSubmission
    });
    // :snippet-end:
    expect(submissionCheck.length).toBe(1);
    expect.soft(submissionCheck[0]).toHaveProperty('tag', 'root');
    expect.soft(submissionCheck[0]).toHaveProperty('status', 'info');
    expect.soft(submissionCheck[0]).toHaveProperty('message', 'ok');
  });

  test('validVerifiablePresentationForPex creates a valid VP', async () => {
    const selectedCredentials = credentials
    const presentationResult = PresentationExchange.createPresentationFromCredentials({
      vcJwts: selectedCredentials,
      presentationDefinition: presentationDefinition
    });
    // :snippet-start: validVerifiablePresentationForPex
    const presentation = presentationResult.presentation;
    // :snippet-end:

    expect(presentation).toBeDefined();
    expect(presentation.type).contains('VerifiablePresentation');
  });

});
