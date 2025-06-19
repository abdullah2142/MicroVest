# investments/views.py
from rest_framework import generics
from rest_framework.response import Response 
from rest_framework import status 
from .models import Business
from .serializers import (
    BusinessListSerializer,
    BusinessDetailSerializer,
    BusinessPitchSerializer,
    InvestmentSerializer# Import the new serializer
)
from django.db.models import F

class InvestAPIView(generics.GenericAPIView):
    serializer_class = InvestmentSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Call the save method of the serializer, which updates the Business model
        updated_data = serializer.save()

        # You can return the updated business data or a success message
        return Response(updated_data, status=status.HTTP_200_OK)

class BusinessDeleteView(generics.DestroyAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessDetailSerializer
    lookup_field = 'id'

class BusinessCreateView(generics.CreateAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessPitchSerializer

class BusinessListView(generics.ListAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessListSerializer

    def get_serializer_context(self): # Add this method to pass request context
        return {'request': self.request}

    def get_queryset(self):
        queryset = super().get_queryset()

        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)

        if category and category != 'All Categories':
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search)
            )

        sort_by = self.request.query_params.get('sort_by', 'trending')

        if sort_by == 'funding':
            queryset = queryset.order_by('-current_funding')
        elif sort_by == 'goal':
            queryset = queryset.order_by('-funding_goal')
        else:
            queryset = queryset.order_by('-backers')

        return queryset

class BusinessDetailView(generics.RetrieveAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessDetailSerializer
    lookup_field = 'id'

    def get_serializer_context(self): # Add this method to pass request context
        return {'request': self.request}