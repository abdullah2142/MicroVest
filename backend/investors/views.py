# investors/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import InvestorProfile # Ensure InvestorProfile is correctly imported
from .serializers import InvestorProfileSerializer # You'll create this serializer

class InvestorProfileView(generics.RetrieveAPIView):
    queryset = InvestorProfile.objects.all()
    serializer_class = InvestorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Retrieve the InvestorProfile linked to the currently authenticated user
        return self.request.user.investor_profile