from django.shortcuts import redirect, render, render_to_response
from landing import forms
from landing.models import AccessCode


# Create your views here.
def landing(request):
    """
    This endpoint serves the landing page.
    """
    if request.user.is_authenticated():
        # Visited site while authenticated
        return redirect('home')
    else:
        # New visiter
        form = forms.BetaSignUpForm()
        code = forms.AccessCodeForm()
    return render_to_response('landing/landing-page.html', {'form': form, 'code': code})

def beta_signup(request):
    """
    This end point accepts beta signup forms.
    """
    if request.method == 'POST':
        # Handle beta sign up
        form = forms.BetaSignUpForm(request.POST)
        if form.is_valid():
            # Form should be valid under normal use due to Parsley
            form.save()
    # New visiter
    return redirect('landing')

def beta_access(request):
    """
    This end point will validate a supplied access code and redirect users to
    the home page if successful.
    """
    if request.method == 'POST':
        code = forms.AccessCodeForm(request.POST)
        if code.is_valid():
            rcv_code = code.cleaned_data['access_code']
            try:
                access_code = AccessCode.objects.get(pk=rcv_code)
                if access_code.valid:
                    response = redirect('home')
                    response.set_cookie('access_code', access_code.code)
                    return response
                else:
                    return redirect('landing')
            except AccessCode.DoesNotExist:
                return redirect('landing')
    return redirect('landing')
