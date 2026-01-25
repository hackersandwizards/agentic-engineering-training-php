<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * List contacts.
     * Superusers see all contacts, regular users see only their own.
     */
    public function index(Request $request): JsonResponse
    {
        $skip = (int) $request->query('skip', 0);
        $limit = min((int) $request->query('limit', 100), 100);

        $query = Contact::with(['owner:id,email,full_name']);

        if (!$request->user()->is_superuser) {
            $query->where('owner_id', $request->user()->id);
        }

        $contacts = $query->orderBy('created_at', 'desc')
            ->skip($skip)
            ->take($limit)
            ->get();

        $countQuery = Contact::query();
        if (!$request->user()->is_superuser) {
            $countQuery->where('owner_id', $request->user()->id);
        }

        return response()->json([
            'data' => $contacts,
            'count' => $countQuery->count(),
        ]);
    }

    /**
     * Create a new contact.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organisation' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $contact = Contact::create([
            'organisation' => $validated['organisation'],
            'description' => $validated['description'] ?? null,
            'owner_id' => $request->user()->id,
        ]);

        return response()->json(
            $contact->load(['owner:id,email,full_name']),
            201
        );
    }

    /**
     * Get a contact by ID.
     */
    public function show(Request $request, Contact $contact): JsonResponse
    {
        if ($contact->owner_id !== $request->user()->id && !$request->user()->is_superuser) {
            return response()->json(['detail' => 'Not enough permissions'], 403);
        }

        return response()->json($contact->load(['owner:id,email,full_name']));
    }

    /**
     * Update a contact.
     */
    public function update(Request $request, Contact $contact): JsonResponse
    {
        if ($contact->owner_id !== $request->user()->id && !$request->user()->is_superuser) {
            return response()->json(['detail' => 'Not enough permissions'], 403);
        }

        $validated = $request->validate([
            'organisation' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $contact->update($validated);

        return response()->json($contact->fresh()->load(['owner:id,email,full_name']));
    }

    /**
     * Delete a contact.
     */
    public function destroy(Request $request, Contact $contact): JsonResponse
    {
        if ($contact->owner_id !== $request->user()->id && !$request->user()->is_superuser) {
            return response()->json(['detail' => 'Not enough permissions'], 403);
        }

        $contact->delete();

        return response()->json(['message' => 'Contact deleted successfully']);
    }
}
