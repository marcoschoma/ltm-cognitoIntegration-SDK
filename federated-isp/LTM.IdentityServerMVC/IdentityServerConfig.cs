using System.Collections.Generic;
using System.Security.Claims;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;

namespace LTM.IdentityServerMVC
{
    public class IdentityServerConfig
    {
        // scopes define the resources in your system
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource> {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
                new IdentityResources.Phone(),
                new IdentityResource("webpremios", new string [] { "campaign_id", "participant_id" })
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            var secret = new Secret("ltm-secret".ToSha256(), "isp-secret");
            // client credentials client
            return new List<Client> {
                // OpenID Connect implicit flow client (MVC)
                new Client {
                    ClientId = "ltm",
                    ClientName = "LTM Federated Client",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireConsent = false,
                    RedirectUris = {
                        "https://localhost:8001/signin-oidc",
                        "https://ltmcognitopocidentityserver.azurewebsites.net/signin-oidc",
                        "https://ltm-ragnarok-tenants-qa2-1.auth.us-east-1.amazoncognito.com/oauth2/idpresponse"
                    },
                    PostLogoutRedirectUris = {
                        "https://localhost:8001/signout-callback-oidc",
                        "https://ltmcognitopocidentityserver.azurewebsites.net/signout-callback-oidc"
                    },
                    ClientSecrets = { secret },
                    AllowedScopes = {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.Email,
                        IdentityServerConstants.StandardScopes.Phone
                    }
                }
            };
        }

        public static List<TestUser> GetUsers()
        {
            return new List<TestUser> {
                new TestUser {
                    SubjectId = "1",
                    Username = "integration.test",
                    Password = "123456",

                    Claims = new List<Claim> {
                        new Claim (JwtClaimTypes.Name, "Integration"),
                        new Claim (JwtClaimTypes.FamilyName, "Test"),
                        new Claim (JwtClaimTypes.GivenName, "Integration Test"),
                        new Claim (JwtClaimTypes.Email, "integration.text@ltm.digital"),
                        new Claim (JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim ("campaign_id", "1", ClaimValueTypes.String),
                        new Claim ("participant_id", "123", ClaimValueTypes.String)
                    }
                }
            };
        }
    }
}