from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """

    # Override
    def has_object_permission(self, request, view, obj):
        return obj == request.user


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """

    # Override
    def has_object_permission(self, request, view, obj):
        return (obj == request.user) or request.user.is_staff
