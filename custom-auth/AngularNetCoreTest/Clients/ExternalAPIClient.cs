using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace AngularNetCoreTest.Clients
{
    public class ExternalAPIClient : IExternalAPIClient
    {

        private readonly HttpClient _httpClient;

        public ExternalAPIClient(HttpClient client)
        {
            _httpClient = client;
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {GetAuthToken()}");
        }

        public async Task<string> Get()
        {
            try
            {
                var response = await _httpClient.GetAsync("https://localhost:8001/api/data");

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private string GetAuthToken()
        {
            var identity = new ClaimsIdentity(
                new GenericIdentity("userId", "Login"),
                new[] {
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
                    new Claim(JwtRegisteredClaimNames.UniqueName, "userId")
                }
            );

            DateTime dataCriacao = DateTime.Now;
            DateTime dataExpiracao = dataCriacao +
                TimeSpan.FromHours(1);

            var tokenConfigurations = new TokenConfigurations();
            var signingConfigurations = new SigningConfigurations();

            var handler = new JwtSecurityTokenHandler();
            var securityToken = handler.CreateToken(new SecurityTokenDescriptor
            {
                Issuer = "https://localhost:5001",
                //Audience = tokenConfigurations.Audience,
                SigningCredentials = signingConfigurations.SigningCredentials,
                Subject = identity,
                NotBefore = dataCriacao,
                Expires = dataExpiracao
            });
            var token = handler.WriteToken(securityToken);
            return token;
            //return new
            //{
            //    authenticated = true,
            //    created = dataCriacao.ToString("yyyy-MM-dd HH:mm:ss"),
            //    expiration = dataExpiracao.ToString("yyyy-MM-dd HH:mm:ss"),
            //    accessToken = token,
            //    message = "OK"
            //};
        }
    }

    public interface IExternalAPIClient
    {
        Task<string> Get();
    }


    public class TokenConfigurations
    {
        public string Audience { get; set; }
        public string Issuer { get; set; }
        public int Seconds { get; set; }
    }

    public class SigningConfigurations
    {
        public SecurityKey Key { get; }
        public SigningCredentials SigningCredentials { get; }

        public SigningConfigurations()
        {
            using (var provider = new RSACryptoServiceProvider(2048))
            {
                Key = new RsaSecurityKey(provider.ExportParameters(true));
            }

            SigningCredentials = new SigningCredentials(
                Key, SecurityAlgorithms.RsaSha256Signature);
        }
    }

}
