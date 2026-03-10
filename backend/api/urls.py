from django.urls import path
from api.views import TransactionListCreateView, TransactionRetrieveUpdateDestroyView


app_name = 'api'
urlpatterns = [
    path('transactions/', TransactionListCreateView.as_view()),
    path('transactions/<uuid:id>/', TransactionRetrieveUpdateDestroyView.as_view()),
]
