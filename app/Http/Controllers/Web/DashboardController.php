<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show dashboard page.
     */
    public function index(Request $request): Response
    {
        $contactCount = $request->user()->is_superuser
            ? Contact::count()
            : Contact::where('owner_id', $request->user()->id)->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'contactCount' => $contactCount,
            ],
        ]);
    }
}
