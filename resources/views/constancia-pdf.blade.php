<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Constancia {{ $folio }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10pt;
            color: #1f2937;
            background: #fff;
        }

        /* Franja superior */
        .top-strip {
            background: #6b1c2b;
            height: 8px;
            width: 100%;
        }

        .page {
            padding: 28px 48px 24px 48px;
        }

        /* ── HEADER ── */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
        }
        .header-logo-cell {
            width: 60px;
            vertical-align: middle;
            padding-right: 12px;
        }
        .logo-box {
            width: 52px;
            height: 52px;
            background: #6b1c2b;
            border-radius: 6px;
            text-align: center;
            line-height: 52px;
            font-size: 22pt;
            font-weight: bold;
            color: #fff;
        }
        .header-text-cell { vertical-align: middle; }
        .header-inst {
            font-size: 7.5pt;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }
        .header-title {
            font-size: 15pt;
            font-weight: bold;
            color: #6b1c2b;
            margin-top: 1px;
            line-height: 1.2;
        }
        .header-sub {
            font-size: 8pt;
            color: #9ca3af;
            margin-top: 2px;
        }
        .header-divider {
            border: none;
            border-top: 2px solid #6b1c2b;
            margin-bottom: 14px;
        }

        /* ── FOLIO BAR ── */
        .folio-table {
            width: 100%;
            border-collapse: collapse;
            background: #fdf6f0;
            border: 1px solid #e5d9cc;
            border-radius: 4px;
            margin-bottom: 16px;
        }
        .folio-left  { padding: 7px 14px; vertical-align: middle; }
        .folio-right { padding: 7px 14px; vertical-align: middle; text-align: right; }
        .folio-label { font-size: 7pt; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
        .folio-value { font-size: 10.5pt; font-weight: bold; color: #6b1c2b; font-family: monospace; margin-top: 1px; }
        .folio-date  { font-size: 8.5pt; color: #374151; margin-top: 1px; }

        /* ── BODY TEXT ── */
        .certifica {
            font-size: 9.5pt;
            line-height: 1.65;
            color: #374151;
            margin-bottom: 12px;
        }
        .certifica b { color: #111827; }

        /* ── DATA TABLES ── */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            border: 1px solid #e5d9cc;
        }
        .data-table td {
            padding: 7px 12px;
            border: 1px solid #e5d9cc;
            vertical-align: top;
            width: 50%;
        }
        .data-table td.bg { background: #fdf6f0; }
        .cell-label {
            font-size: 7pt;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 2px;
        }
        .cell-value {
            font-size: 9.5pt;
            font-weight: bold;
            color: #111827;
        }

        /* tipo badge */
        .badge {
            display: inline;
            padding: 1px 8px;
            border-radius: 10px;
            font-size: 8pt;
            font-weight: bold;
        }
        .badge-deportiva { background: #dbeafe; color: #1d4ed8; }
        .badge-cultural  { background: #fef3c7; color: #92400e; }

        /* ── CRÉDITOS ── */
        .creditos-box {
            background: #6b1c2b;
            color: #fff;
            border-radius: 6px;
            padding: 10px 0;
            text-align: center;
            margin-bottom: 10px;
        }
        .creditos-num   { font-size: 24pt; font-weight: bold; line-height: 1; }
        .creditos-label { font-size: 8pt; margin-top: 3px; opacity: 0.85; }

        /* ── VALIDEZ + QR ── */
        .validity-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 4px;
        }
        .validity-text-cell {
            padding: 10px 12px;
            vertical-align: middle;
            font-size: 8.5pt;
            color: #166534;
        }
        .validity-qr-cell {
            width: 100px;
            text-align: center;
            padding: 6px 8px;
            vertical-align: middle;
            border-left: 1px solid #bbf7d0;
        }
        .validity-qr-cell img { display: block; margin: 0 auto; }
        .qr-label { font-size: 6.5pt; color: #6b7280; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.6px; }

        /* ── FIRMAS ── */
        .sig-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 12px;
        }
        .sig-cell {
            width: 33.33%;
            text-align: center;
            padding: 0 10px;
            vertical-align: bottom;
        }
        .sig-spacer { height: 36px; }
        .sig-line {
            border-top: 1px solid #374151;
            padding-top: 6px;
        }
        .sig-name  { font-size: 8.5pt; font-weight: bold; color: #111827; }
        .sig-title { font-size: 7.5pt; color: #6b7280; margin-top: 1px; }

        /* ── FOOTER ── */
        .footer-divider { border: none; border-top: 1px solid #e5d9cc; margin-bottom: 6px; }
        .footer {
            text-align: center;
            font-size: 7pt;
            color: #9ca3af;
        }
    </style>
</head>
<body>

<div class="top-strip"></div>

<div class="page">

    <!-- HEADER -->
    <table class="header-table">
        <tr>
            <td class="header-logo-cell">
                <div class="logo-box">T</div>
            </td>
            <td class="header-text-cell">
                <div class="header-inst">Tecnológico de Estudios Superiores de Chalco</div>
                <div class="header-title">Constancia de Actividad Complementaria</div>
                <div class="header-sub">Sistema de Administración de Actividades Complementarias — S.A.A.C.</div>
            </td>
        </tr>
    </table>
    <hr class="header-divider">

    <!-- FOLIO BAR -->
    <table class="folio-table">
        <tr>
            <td class="folio-left">
                <div class="folio-label">Folio</div>
                <div class="folio-value">{{ $folio }}</div>
            </td>
            <td class="folio-right">
                <div class="folio-label">Fecha de emisión</div>
                <div class="folio-date">{{ $fecha_emision }}</div>
            </td>
        </tr>
    </table>

    <!-- TEXTO CERTIFICA -->
    <p class="certifica">
        El <b>Tecnológico de Estudios Superiores de Chalco (TESCHa)</b>, a través del
        <b>Departamento de Servicios Académicos y Atención Complementaria (S.A.A.C.)</b>,
        certifica que el (la) alumno(a):
    </p>

    <!-- DATOS ALUMNO -->
    <table class="data-table">
        <tr>
            <td class="bg">
                <div class="cell-label">Nombre completo</div>
                <div class="cell-value">{{ $alumno_nombre }}</div>
            </td>
            <td>
                <div class="cell-label">Matrícula</div>
                <div class="cell-value">{{ $matricula }}</div>
            </td>
        </tr>
        <tr>
            <td class="bg">
                <div class="cell-label">Carrera</div>
                <div class="cell-value">{{ $carrera }}</div>
            </td>
            <td>
                <div class="cell-label">Semestre</div>
                <div class="cell-value">{{ $semestre }}°</div>
            </td>
        </tr>
    </table>

    <p class="certifica">Acreditó satisfactoriamente la siguiente actividad complementaria:</p>

    <!-- DATOS ACTIVIDAD -->
    <table class="data-table">
        <tr>
            <td class="bg" style="width:62%">
                <div class="cell-label">Actividad</div>
                <div class="cell-value">{{ $actividad_nombre }}</div>
            </td>
            <td style="width:38%">
                <div class="cell-label">Tipo</div>
                <div class="cell-value">
                    <span class="badge badge-{{ $tipo }}">{{ ucfirst($tipo) }}</span>
                </div>
            </td>
        </tr>
        <tr>
            <td class="bg">
                <div class="cell-label">Docente responsable</div>
                <div class="cell-value">{{ $docente }}</div>
            </td>
            <td>
                <div class="cell-label">Fecha de acreditación</div>
                <div class="cell-value">{{ $fecha_acreditacion }}</div>
            </td>
        </tr>
    </table>

    <!-- CRÉDITOS -->
    <div class="creditos-box">
        <div class="creditos-num">{{ $creditos }}</div>
        <div class="creditos-label">{{ $creditos == 1 ? 'Crédito complementario obtenido' : 'Créditos complementarios obtenidos' }}</div>
    </div>

    <!-- VALIDEZ + QR -->
    <table class="validity-table">
        <tr>
            <td class="validity-text-cell">
                ✓ Este documento cuenta con validez digital. El folio <b>{{ $folio }}</b>
                puede ser verificado ante el Departamento S.A.A.C. del plantel.<br><br>
                Escanea el código QR para verificar la autenticidad de esta constancia.
            </td>
            <td class="validity-qr-cell">
                <img src="{{ $qr_base64 }}" width="80" height="80" alt="QR de verificación">
                <div class="qr-label">Verificación</div>
            </td>
        </tr>
    </table>

    <!-- FIRMAS -->
    <table class="sig-table">
        <tr>
            <td class="sig-cell">
                <div class="sig-spacer"></div>
                <div class="sig-line">
                    <div class="sig-name">{{ $docente }}</div>
                    <div class="sig-title">Docente Responsable</div>
                </div>
            </td>
            <td class="sig-cell">
                <div class="sig-spacer"></div>
                <div class="sig-line">
                    <div class="sig-name">Coordinación S.A.A.C.</div>
                    <div class="sig-title">Departamento de Actividades Complementarias</div>
                </div>
            </td>
            <td class="sig-cell">
                <div class="sig-spacer"></div>
                <div class="sig-line">
                    <div class="sig-name">Subdirección Académica</div>
                    <div class="sig-title">TESCHa</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- FOOTER -->
    <hr class="footer-divider">
    <div class="footer">
        Tecnológico de Estudios Superiores de Chalco (TESCHa) &nbsp;·&nbsp;
        Sistema S.A.A.C. v1.0 &nbsp;·&nbsp;
        Documento generado el {{ $generado_en }}
    </div>

</div><!-- /page -->
</body>
</html>
