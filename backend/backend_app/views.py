from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_status(request):
    return Response({
        "success": True,
        "message": "TaskFlow API is running!",
        "version": "1.0",
    })
