class TokenToBearerMiddleware:
    """
    The existing React frontend stores JWT access tokens in localStorage
    under the key 'nn_token' and sends them as:

        Authorization: Token <access_token>

    Django REST Framework's SimpleJWT expects:

        Authorization: Bearer <access_token>

    This middleware transparently rewrites the prefix so both auth styles
    are accepted without touching the frontend code.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Token '):
            jwt_value = auth_header[len('Token '):]
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {jwt_value}'
        return self.get_response(request)
