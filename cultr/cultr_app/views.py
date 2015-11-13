from django.shortcuts import redirect, render_to_response
from landing.models import AccessCode

def render_with_access(request, template, params):
	if request.user.is_authenticated():
		# User is logged in
		return render_to_response(template, params)
	# Anonymous user
	code = request.COOKIES.get('access_code')
	if code:
		# Access code cookie set
		try:
			access_code = AccessCode.objects.get(pk=code)
			if access_code.valid:
				# Valid access code
				return render_to_response(template, params)
			# Invalid access code
			return redirect('landing')
		except AccessCode.DoesNotExist:
			# Access code not found
			return redirect('landing')
	else:
		# Access code cookie not set
		return redirect('landing')

def home(request):
	return render_with_access(request, "cultr_app/index.html", {})

def contact_us(request):
	return None

def terms_of_service(request):
	return render_with_access(request, "cultr_app/terms-of-service.html",{})
