from django import forms
from landing.models import BetaSignUp
from parsley.decorators import parsleyfy


@parsleyfy
class BetaSignUpForm(forms.ModelForm):
    """
    The form for information of potential beta users.
    """
    class Meta:
        model = BetaSignUp
        fields = ['name', 'email', 'twitter_handle', 'organization', 'project', 'purpose', 'coauthors']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'id': 'recipient-name'}),
            'email': forms.TextInput(attrs={'class': 'form-control', 'id': 'recipient-name'}),
            'twitter_handle': forms.TextInput(attrs={'class': 'form-control', 'id': 'recipient-name'}),
            'organization': forms.TextInput(attrs={'class': 'form-control', 'id': 'recipient-name'}),
            'project': forms.Textarea(attrs={'class': 'form-control', 'id': 'message-text', 'rows': 2}),
            'purpose': forms.Textarea(attrs={'class': 'form-control', 'id': 'message-text', 'rows': 2}),
            'coauthors': forms.Textarea(attrs={'class': 'form-control', 'id': 'message-text', 'rows': 1}),
        }


class AccessCodeForm(forms.Form):
    """
    Access code entry.
    """
    access_code = forms.CharField(max_length=32, widget=forms.PasswordInput())
