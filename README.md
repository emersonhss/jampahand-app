# maximushc-app

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
"# maximushc-app"


## Teste com Mercado Pago - Usuário Vendedor

```json
{
    "access_token": "APP_USR-1864171095749479-081123-a0a7103d594a74ef19efdade99cba1bd__G_C__-89639633",
    "refresh_token": "TG-598e7442e4b02a85dc7d888a-89639633",
    "live_mode": true,
    "user_id": 89639633,
    "token_type": "bearer",
    "expires_in": 21600,
    "scope": "offline_access read write"
}
```

```json
{
    "id": 268296318,
    "nickname": "TESTEJTD86DG",
    "password": "qatest249",
    "site_status": "active",
    "email": "test_user_59155188@testuser.com"
}
```

## Teste com Mercado Pago - Usuário Comprador

```json
{
    "access_token": "APP_USR-1864171095749479-081123-3b3f04246c84ad3a3dd1c17fa4d553e5__J_D__-89639633",
    "refresh_token": "TG-598e7b84e4b0e3012df1e897-89639633",
    "live_mode": true,
    "user_id": 89639633,
    "token_type": "bearer",
    "expires_in": 21600,
    "scope": "offline_access read write"
}
```

```json
{
    "id": 268298885,
    "nickname": "TETE9313678",
    "password": "qatest7935",
    "site_status": "active",
    "email": "test_user_35106589@testuser.com"
}
```

http://maximusclube.com.br/pagamento-aprovado/?collection_id=2914916173&collection_status=approved&preference_id=268296318-e5fb75db-c6bb-449e-972d-36ff3b96c86d&external_reference=MAXIMUS_SOCIO_TOCEDOR&payment_type=credit_card&merchant_order_id=545277047

# Brasil  
Visa: 4235 6477 2802 5682
Master: 5031 4332 1540 6351
American: 3753 651535 56885

# Prefixos de nomes do resultado esperado
APRO Approved payment
CONT Pending payment
CALL Rejected. Call for authorize
FUND Rejected by insufficient amount
SECU Rejected by security code
EXPI Rejected by expiration date
FORM Rejected by an error in the form
OTHE General rejection
