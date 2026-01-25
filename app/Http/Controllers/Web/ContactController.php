<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Show contacts list page.
     */
    public function index(Request $request): Response
    {
        $perPage = 5;

        $query = Contact::with(['owner:id,email,full_name']);

        if (!$request->user()->is_superuser) {
            $query->where('owner_id', $request->user()->id);
        }

        $contacts = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
        ]);
    }

    /**
     * Create a new contact.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'organisation' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Contact::create([
            'organisation' => $validated['organisation'],
            'description' => $validated['description'] ?? null,
            'owner_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Contact created successfully');
    }

    /**
     * Update a contact.
     */
    public function update(Request $request, Contact $contact): RedirectResponse
    {
        if ($contact->owner_id !== $request->user()->id && !$request->user()->is_superuser) {
            abort(403, 'Not enough permissions');
        }

        $validated = $request->validate([
            'organisation' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $contact->update($validated);

        return redirect()->back()->with('success', 'Contact updated successfully');
    }

    /**
     * Delete a contact.
     */
    public function destroy(Request $request, Contact $contact): RedirectResponse
    {
        if ($contact->owner_id !== $request->user()->id && !$request->user()->is_superuser) {
            abort(403, 'Not enough permissions');
        }

        $contact->delete();

        return redirect()->back()->with('success', 'Contact deleted successfully');
    }
}
